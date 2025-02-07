import os
import json
import time
import requests
import replicate
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime

"""
Recraft AI 支持的图片生成风格说明：

1. 基础风格：
   - "any": 任意风格，AI自动选择最适合的风格

2. 数字插画系列 (digital_illustration)：
   - "digital_illustration": 基础数字插画
   - "digital_illustration/pixel_art": 像素艺术
   - "digital_illustration/hand_drawn": 手绘风格
   - "digital_illustration/grain": 颗粒感风格
   - "digital_illustration/infantile_sketch": 童趣素描
   - "digital_illustration/2d_art_poster": 2D艺术海报
   - "digital_illustration/handmade_3d": 手工3D风格
   - "digital_illustration/hand_drawn_outline": 手绘轮廓
   - "digital_illustration/engraving_color": 彩色雕刻风格
   - "digital_illustration/2d_art_poster_2": 2D艺术海报第二版

3. 真实图片系列 (realistic_image)：
   - "realistic_image/b_and_w": 黑白风格
   - "realistic_image/hard_flash": 强闪光效果
   - "realistic_image/hdr": HDR效果
   - "realistic_image/natural_light": 自然光效果
   - "realistic_image/studio_portrait": 工作室人像
   - "realistic_image/enterprise": 企业级商务风格
   - "realistic_image/motion_blur": 运动模糊效果

本脚本使用 "realistic_image/enterprise" 风格，原因：
1. 最适合展示专业的SaaS产品界面
2. 突出企业级商务美感
3. 适合展示软件仪表板和数据可视化
4. 保持专业的产品形象

选择风格建议：
- 产品展示：使用 enterprise 或 natural_light
- 艺术创意：使用 digital_illustration 系列
- 人物展示：使用 studio_portrait
- 特殊效果：根据需求选择特定风格
"""

# 加载环境变量
load_dotenv(".env.local")

# 设置API密钥
api_token = os.getenv("REPLICATE_API_TOKEN")
print("api_token", api_token)
os.environ["REPLICATE_API_TOKEN"] = api_token

# 记录文件路径
RECORD_FILE = "./saas_generation_record.json"

# 支持的尺寸列表
SUPPORTED_SIZES = [
    "1024x1024",
    "1365x1024",  # 4:3
    "1024x1365",
    "1536x1024",  # 3:2
    "1024x1536",
    "1820x1024",  # 16:9
    "1024x1820",
]

def load_generation_record():
    """加载生成记录"""
    if os.path.exists(RECORD_FILE):
        with open(RECORD_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_generation_record(record):
    """保存生成记录"""
    os.makedirs(os.path.dirname(RECORD_FILE), exist_ok=True)
    with open(RECORD_FILE, "w", encoding="utf-8") as f:
        json.dump(record, f, ensure_ascii=False, indent=2)

def find_closest_size(target_width, target_height):
    """找到最接近的支持尺寸"""
    target_ratio = target_width / target_height
    closest_size = None
    min_diff = float("inf")

    for size in SUPPORTED_SIZES:
        w, h = map(int, size.split("x"))
        ratio = w / h
        diff = abs(ratio - target_ratio)

        if diff < min_diff:
            min_diff = diff
            closest_size = size

    return closest_size

# 图片配置
IMAGE_CONFIGS = [
    {
        "filename": "logo.png",
        "size": "512x512",
        "prompt": """minimalist modern rocket logo with 'Ship SaaS 1 Click' text,
                  clean geometric rocket shape pointing upward,
                  professional blue and white color scheme,
                  simple and memorable tech startup logo,
                  modern sans-serif typography,
                  scalable vector style,
                  suitable for website header and app icon""",
        "style": "any",  # 使用2D海报风格，适合logo设计
        "output_path": "./public/imgs/logo.png",
    },
    {
        "filename": "hero.png",
        "size": "1280x500",
        "prompt": """professional enterprise SaaS platform interface, featuring 'Ship SaaS One Click' text in modern typography,
                  clean and minimal business software dashboard, enterprise-grade UI design,
                  professional blue and white color scheme with subtle gradients,
                  modern tech elements, cloud deployment visualization,
                  high-end corporate aesthetic, premium business software appearance""",
        "style": "any",  # 使用企业级商务风格
        "output_path": "./public/imgs/hero.png",
    },
    {
        "filename": "section-1.png",
        "size": "700x500",
        "prompt": """enterprise user management dashboard, featuring 'Complete User System' text,
                  professional authentication interface mockup, corporate user analytics view,
                  clean enterprise design system, business software UI components,
                  modern data visualization, premium SaaS platform aesthetic,
                  professional blue and white corporate color scheme""",
        "style": "any",  # 使用企业级商务风格
        "output_path": "./public/imgs/section-1.png",
    },
    {
        "filename": "section-2.png",
        "size": "700x500",
        "prompt": """enterprise AI integration platform, showing 'AI Integration' text,
                  professional machine learning dashboard interface, corporate tech visualization,
                  modern business analytics view, premium enterprise software design,
                  clean data processing workflow, high-end tech platform appearance,
                  professional blue and white business aesthetic""",
        "style": "any",  # 使用企业级商务风格
        "output_path": "./public/imgs/section-2.png",
    },
    {
        "filename": "section-3.png",
        "size": "700x500",
        "prompt": """enterprise deployment workflow, featuring 'Launch in 3 Steps' text,
                  professional DevOps dashboard interface, corporate cloud infrastructure view,
                  modern step-by-step process visualization, premium business platform design,
                  clean enterprise aesthetic, high-end tech deployment appearance,
                  professional blue and white color scheme""",
        "style": "any",  # 使用企业级商务风格
        "output_path": "./public/imgs/section-3.png",
    }
]

def generate_image(prompt, size, output_path, filename, record):
    """生成单张图片"""
    try:
        # 检查是否已经成功生成
        if filename in record and record[filename]["status"] == "success":
            print(f"跳过已成功生成的图片: {output_path}")
            return True

        # 解析目标尺寸
        target_width, target_height = map(int, size.split("x"))
        # 获取最接近的支持尺寸
        actual_size = find_closest_size(target_width, target_height)

        print(f"生成图片: {output_path}")
        print(f"目标尺寸: {size} -> 实际使用尺寸: {actual_size}")

        # 获取配置中的风格，如果没有则使用默认风格
        style = next((config["style"] for config in IMAGE_CONFIGS if config["filename"] == filename), "realistic_image/enterprise")
        print(f"使用风格: {style}")

        # 调用API生成图片
        image_url = replicate.run(
            "recraft-ai/recraft-v3",
            input={
                "size": actual_size,
                "prompt": prompt,
                "style": style,
            },
        )

        # 下载图片
        response = requests.get(image_url)
        response.raise_for_status()

        # 确保输出目录存在
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # 保存图片
        with open(output_path, "wb") as file:
            file.write(response.content)

        print(f"✓ 成功生成图片: {output_path}")

        # 更新记录
        record[filename] = {
            "status": "success",
            "last_attempt": datetime.now().isoformat(),
            "error": None,
        }
        save_generation_record(record)

        return True

    except Exception as e:
        error_msg = str(e)
        print(f"× 生成图片失败 {output_path}: {error_msg}")

        # 更新记录
        record[filename] = {
            "status": "failed",
            "last_attempt": datetime.now().isoformat(),
            "error": error_msg,
        }
        save_generation_record(record)

        return False

def main():
    """主函数"""
    print("开始生成 Ship SaaS One Click 营销图片...")

    # 加载记录
    record = load_generation_record()

    # 统计
    total = len(IMAGE_CONFIGS)
    success = 0
    skipped = 0
    failed = 0

    for config in IMAGE_CONFIGS[:]:
        if generate_image(
            prompt=config["prompt"],
            size=config["size"],
            output_path=config["output_path"],
            filename=config["filename"],
            record=record,
        ):
            if config["filename"] in record and record[config["filename"]]["status"] == "success":
                skipped += 1
            else:
                success += 1
        else:
            failed += 1

    print("\n生成完成!")
    print(f"总计: {total} 张图片")
    print(f"成功: {success} 张")
    print(f"跳过: {skipped} 张")
    print(f"失败: {failed} 张")

if __name__ == "__main__":
    main() 