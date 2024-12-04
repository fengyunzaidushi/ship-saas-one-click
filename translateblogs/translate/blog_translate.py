import os
import time
from pathlib import Path
from typing import Dict, Optional, Any, Set, Tuple
import frontmatter
import yaml
from openai import OpenAI
from openai import AsyncOpenAI
from tqdm import tqdm
import logging
from dataclasses import dataclass, field
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
import asyncio
from asyncio import Semaphore

@dataclass
class TranslationConfig:
    """翻译配置类"""
    source_lang: str
    target_lang: str
    
    # 默认排除翻译的字段
    exclude_fields: Set[str] = field(default_factory=lambda: {
        # 日期相关
        'date', 'created_at', 'updated_at', 'published_at', 'last_modified',
        
        # URL相关
        'url', 'permalink', 'slug'
    })

    def __post_init__(self):
        self.exclude_fields = {field.lower() for field in self.exclude_fields}

class MDXTranslator:
    def __init__(
        self,
        config: TranslationConfig,
        input_dir: str,
        model: str = "gpt-4o-mini"
    ):
        """初始化翻译器"""
        # 从环境变量读取API密钥
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("未找到 OPENAI_API_KEY 环境变量")
            
        self.client = OpenAI(api_key=api_key)
        self.config = config
        self.model = model
        
        # 处理输入目录
        self.input_dir = Path(input_dir)
        if not self.input_dir.exists():
            raise ValueError(f"输入目录不存在: {input_dir}")
            
        # 设置输出目录
        input_dir_path = Path(input_dir)
        self.output_dir_mdx = input_dir_path.parent / f"{input_dir_path.name}_trans"
        self.output_dir_md = input_dir_path.parent / f"{input_dir_path.name}_trans_md"
        
        # 创建输出目录
        self.output_dir_mdx.mkdir(parents=True, exist_ok=True)
        self.output_dir_md.mkdir(parents=True, exist_ok=True)
        
        self._setup_logging()
        self.logger.info(f"输入目录: {self.input_dir}")
        self.logger.info(f"MDX输出目录: {self.output_dir_mdx}")
        self.logger.info(f"MD输出目录: {self.output_dir_md}")
        
        self.rate_limit = Semaphore(60)  # 每分钟最多60个请求

    def _setup_logging(self):
        """设置日志记录"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('mdx_translation.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def _get_translation_prompt(self, content: Dict) -> str:
        """生成翻译提示词"""
        frontmatter_fields = content.get('frontmatter', {}).keys()
        translate_fields = [
            field for field in frontmatter_fields 
            if field.lower() not in self.config.exclude_fields
        ]
        
        template = f"""You are an AI expert skilled in data processing and multilingual translation.
Task: Translate the following MDX document from {self.config.source_lang} to {self.config.target_lang}.

Translation Rules:
1. Professional Style:
   - Use formal and professional language
   - Maintain consistent technical terminology
   - Adapt to target language conventions
   - Keep technical terms accuracy

2. Format Requirements:
   - Keep the EXACT same document structure
   - Preserve all markdown formatting
   - Keep code blocks unchanged
   - Keep HTML tags unchanged
   - Keep URLs unchanged

3. Field-specific Rules:
   - Translate these fields: {', '.join(translate_fields)}
   - Keep these fields unchanged: {', '.join(self.config.exclude_fields)}
   - Keep description in single line

4. Content Structure:
Document to translate:
---
{yaml.dump(content['frontmatter'], allow_unicode=True)}
---

{content['content']}

Return the complete translation maintaining the same structure and formatting."""

        return template

    def _convert_to_md(self, mdx_content: str) -> str:
        """将MDX格式转换为MD格式，包括处理图片路径"""
        import re
        
        def process_frame_image(match):
            """处理Frame中的图片标签"""
            frame_content = match.group(1)
            # 查找img标签
            img_pattern = r'<img\s+src="([^"]+)"[^>]*>'
            img_match = re.search(img_pattern, frame_content)
            if img_match:
                src_path = img_match.group(1)
                # 转换路径格式
                return f'![](..{src_path})'
            return match.group(0)

        def process_single_image(match):
            """处理单独的图片标签"""
            src_path = match.group(1)
            return f'![](..{src_path})'

        # 移除MDX特有的导入语句
        lines = [
            line for line in mdx_content.split('\n')
            if not line.strip().startswith('import ')
        ]
        content = '\n'.join(lines)
        
        # 处理被Frame包裹的图片
        frame_pattern = r'<Frame>\s*([^<]*<img[^>]+>[^<]*)\s*</Frame>'
        content = re.sub(frame_pattern, process_frame_image, content, flags=re.IGNORECASE)
        
        # 处理单独的图片标签
        img_pattern = r'<img\s+src="([^"]+)"[^>]*>'
        content = re.sub(img_pattern, process_single_image, content)
        
        # 处理其他MDX特有的组件标签
        mdx_replacements = {
            '<Note>': '> Note: ',
            '</Note>': '',
            '<Warning>': '> Warning: ',
            '</Warning>': '',
            '<Tip>': '> Tip: ',
            '</Tip>': '',
            '<Info>': '> Info: ',
            '</Info>': ''
        }
        
        for mdx_tag, md_replacement in mdx_replacements.items():
            content = content.replace(mdx_tag, md_replacement)
        
        return content

    async def _save_content(self, content: str, output_path: Path, is_md: bool = False) -> None:
        """异步保存翻译后的内容到文件"""
        try:
            # 确保输出目录存在
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # 如果是MD格式，转换内容
            if is_md:
                content = self._convert_to_md(content)
                
            # 异步写入文件
            await asyncio.to_thread(output_path.write_text, content, encoding='utf-8')
            
        except Exception as e:
            self.logger.error(f"保存文件失败 {output_path}: {str(e)}")
            raise

    async def _api_call_with_rate_limit(self, prompt):
        """使用速率限制的API调用"""
        async with self.rate_limit:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a professional technical document translator. Return only the translated content without any explanations or additional text."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1
            )
            return response.choices[0].message.content.strip()

    async def translate_file(self, file_path: Path) -> None:
        """异步翻译单个文件"""
        try:
            # 读取MDX文件
            post = frontmatter.load(file_path)
            
            # 准备翻译内容
            content = {
                'frontmatter': dict(post.metadata),
                'content': post.content
            }
            
            # 添加翻译元数据
            content['frontmatter'].update({
                'translatedFrom': self.config.source_lang,
                'translatedTo': self.config.target_lang,
                'translatedDate': datetime.now().isoformat()
            })
            
            # 生成提示词并翻译
            prompt = self._get_translation_prompt(content)
            
            try:
                translated_content = await self._api_call_with_rate_limit(prompt)
                
                # 获取相对路径
                relative_path = file_path.relative_to(self.input_dir)
                
                # 异步保存MDX格式
                mdx_output_path = self.output_dir_mdx / relative_path
                await self._save_content(translated_content, mdx_output_path)
                
                # 异步保存MD格式
                md_output_path = self.output_dir_md / relative_path.with_suffix('.md')
                await self._save_content(translated_content, md_output_path, is_md=True)
                
                self.logger.info(f"已完成文件翻译: {relative_path}")
                
            except Exception as e:
                self.logger.error(f"翻译过程出错: {str(e)}")
                raise
                
        except Exception as e:
            self.logger.error(f"处理文件失败 {file_path}: {str(e)}")
            raise

    async def translate_directory(self) -> None:
        """异步翻译目录下的所有MDX文件，应用速率限制"""
        mdx_files = list(self.input_dir.rglob("*.mdx"))[:]
        total_files = len(mdx_files)
        self.logger.info(f"找到 {total_files} 个MDX文件")
        
        if total_files == 0:
            self.logger.warning("未找到任何MDX文件")
            return
            
        # 直接使用异步函数并发处理文件翻译
        tasks = [self.translate_file(file_path) for file_path in mdx_files]
        await asyncio.gather(*tasks)
        
        self.logger.info(f"翻译完成")
        self.logger.info(f"MDX输出目录: {self.output_dir_mdx}")
        self.logger.info(f"MD输出目录: {self.output_dir_md}")

async def main():
    # 配置示例
    config = TranslationConfig(
        source_lang="English",
        target_lang="简体中文"
    )
    
    # 输入目录路径
    input_dir = [r"E:\share\github\011\next.js\docs",r"E:\share\github\011\next-intl\docs\src\pages\docs",r"E:\share\github\011\google_auth_demo\data\blog\en"][-1]
    
    try:
        # 初始化翻译器
        translator = MDXTranslator(
            config=config,
            input_dir=input_dir
        )
        
        # 开始翻译
        await translator.translate_directory()
        
    except Exception as e:
        logging.error(f"翻译过程出错: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())