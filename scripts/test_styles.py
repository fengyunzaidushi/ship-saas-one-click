import os
import json
import time
import requests
import replicate
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime

# 加载环境变量
load_dotenv(".env.local")

# 设置API密钥
api_token = os.getenv("REPLICATE_API_TOKEN")
print("api_token", api_token)
os.environ["REPLICATE_API_TOKEN"] = api_token

# 记录文件路径
RECORD_FILE = "./styles_test_record.json"

# 输出目录
STYLES_DIR = "./public/imgs/styles"

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

# 所有支持的风格列表
STYLES = [
    "any",
    "digital_illustration",
    "digital_illustration/pixel_art",
    "digital_illustration/hand_drawn",
    "digital_illustration/grain",
    "digital_illustration/infantile_sketch",
    "digital_illustration/2d_art_poster",
    "digital_illustration/handmade_3d",
    "digital_illustration/hand_drawn_outline",
    "digital_illustration/engraving_color",
    "digital_illustration/2d_art_poster_2",
    "realistic_image/b_and_w",
    "realistic_image/hard_flash",
    "realistic_image/hdr",
    "realistic_image/natural_light",
    "realistic_image/studio_portrait",
    "realistic_image/enterprise",
    "realistic_image/motion_blur"
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

def get_style_filename(style, index):
    """生成风格测试图片的文件名"""
    # 将风格名称中的/替换为_
    style_name = style.replace("/", "_")
    return f"hero_style_{index:02d}_{style_name}.png"

def generate_image(prompt, size, style, index, record):
    """生成单张图片"""
    try:
        # 生成输出文件名
        filename = get_style_filename(style, index)
        output_path = os.path.join(STYLES_DIR, filename)

        # 检查是否已经成功生成
        if filename in record and record[filename]["status"] == "success":
            print(f"跳过已成功生成的图片: {output_path}")
            return True

        # 解析目标尺寸
        target_width, target_height = map(int, size.split("x"))
        # 获取最接近的支持尺寸
        actual_size = find_closest_size(target_width, target_height)

        print(f"生成图片: {output_path}")
        print(f"风格: {style}")
        print(f"目标尺寸: {size} -> 实际使用尺寸: {actual_size}")

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
        os.makedirs(STYLES_DIR, exist_ok=True)

        # 保存图片
        with open(output_path, "wb") as file:
            file.write(response.content)

        print(f"✓ 成功生成图片: {output_path}")

        # 更新记录
        record[filename] = {
            "status": "success",
            "style": style,
            "last_attempt": datetime.now().isoformat(),
            "error": None,
        }
        save_generation_record(record)

        return True

    except Exception as e:
        error_msg = str(e)
        print(f"× 生成图片失败 {style}: {error_msg}")

        # 更新记录
        record[filename] = {
            "status": "failed",
            "style": style,
            "last_attempt": datetime.now().isoformat(),
            "error": error_msg,
        }
        save_generation_record(record)

        return False

def main():
    """主函数"""
    print("开始测试不同风格的效果...")

    # Hero图片的配置
    hero_config = {
        "size": "1280x500",
        "prompt": """professional enterprise SaaS platform interface, featuring 'Ship SaaS One Click' text in modern typography,
                  clean and minimal business software dashboard, enterprise-grade UI design,
                  professional blue and white color scheme with subtle gradients,
                  modern tech elements, cloud deployment visualization,
                  high-end corporate aesthetic, premium business software appearance""",
    }

    # 加载记录
    record = load_generation_record()

    # 统计
    total = len(STYLES)
    success = 0
    skipped = 0
    failed = 0

    # 为每种风格生成图片
    for index, style in enumerate(STYLES, 1):
        if generate_image(
            prompt=hero_config["prompt"],
            size=hero_config["size"],
            style=style,
            index=index,
            record=record,
        ):
            if get_style_filename(style, index) in record and record[get_style_filename(style, index)]["status"] == "success":
                skipped += 1
            else:
                success += 1
        else:
            failed += 1

        # 添加延时避免API限制
        time.sleep(1)

    print("\n测试完成!")
    print(f"总计: {total} 种风格")
    print(f"成功: {success} 个")
    print(f"跳过: {skipped} 个")
    print(f"失败: {failed} 个")
    print(f"\n图片保存在: {STYLES_DIR}")

if __name__ == "__main__":
    main() 