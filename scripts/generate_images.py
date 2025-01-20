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
RECORD_FILE = "./generation_record.json"

# 支持的尺寸列表
SUPPORTED_SIZES = [
    "1024x1024",
    "1365x1024",  # 4:3
    "1024x1365",
    "1536x1024",  # 3:2
    "1024x1536",
    "1820x1024",  # 16:9
    "1024x1820",
    "1024x2048",
    "2048x1024",
    "1434x1024",
    "1024x1434",
    "1024x1280",  # 4:5
    "1280x1024",
    "1024x1707",
    "1707x1024",
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
        "filename": "hero.png",
        "size": "1280x500",
        "prompt": "A modern, minimalist interface of a character name generator tool, with elegant typography and a clean design layout, showing Chinese characters and names in a beautiful arrangement",
        "output_path": "./public/imgs/hero.png",
    },
    {
        "filename": "section-1.png",
        "size": "700x500",
        "prompt": "A creative visualization of a Chinese name generation process, showing floating Chinese characters transforming into beautiful names, with soft lighting and modern design elements",
        "output_path": "./public/imgs/section-1.png",
    },
    {
        "filename": "section-2.png",
        "size": "700x500",
        "prompt": "An artistic representation of Chinese calligraphy and modern technology merging together, showing the process of creating character names with AI assistance",
        "output_path": "./public/imgs/section-2.png",
    },
    {
        "filename": "section-3.png",
        "size": "700x500",
        "prompt": "A step-by-step visual guide showing the interface of a name generator tool, with Chinese text input and multiple name suggestions displayed in an elegant layout",
        "output_path": "./public/imgs/section-3.png",
    },
    {
        "filename": "avatar-1.png",
        "size": "60x60",
        "prompt": "Professional headshot of a Chinese writer, female, warm smile, neutral background",
        "output_path": "./public/imgs/avatars/avatar-1.png",
    },
    {
        "filename": "avatar-2.png",
        "size": "60x60",
        "prompt": "Professional headshot of a Chinese screenwriter, female, confident expression, neutral background",
        "output_path": "./public/imgs/avatars/avatar-2.png",
    },
    {
        "filename": "avatar-3.png",
        "size": "60x60",
        "prompt": "Professional headshot of a Chinese game developer, male, friendly expression, neutral background",
        "output_path": "./public/imgs/avatars/avatar-3.png",
    },
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

        # 调用API生成图片
        image_url = replicate.run(
            "recraft-ai/recraft-v3",
            input={
                "size": actual_size,
                "prompt": prompt,
                "style": "realistic_image/natural_light",  # 使用自然光风格
            },
        )

        # 下载图片
        response = requests.get(image_url)
        response.raise_for_status()  # 确保请求成功

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
    print("开始生成图片...")

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
            if (
                config["filename"] in record
                and record[config["filename"]]["status"] == "success"
            ):
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
    pass
