from pathlib import Path
from PIL import Image

SRC_FILES = [
    Path('/home/ubuntu/screenshots/3000-is1n6rzo03lon61_2026-04-19_08-55-58_1026.webp'),
    Path('/home/ubuntu/screenshots/3000-is1n6rzo03lon61_2026-04-19_08-56-16_2323.webp'),
    Path('/home/ubuntu/screenshots/3000-is1n6rzo03lon61_2026-04-19_08-56-58_6102.webp'),
    Path('/home/ubuntu/screenshots/3000-is1n6rzo03lon61_2026-04-19_08-57-18_8522.webp'),
    Path('/home/ubuntu/screenshots/3000-is1n6rzo03lon61_2026-04-19_18-37-59_5659.webp'),
]

for src in SRC_FILES:
    if not src.exists():
        print(f'missing: {src}')
        continue
    dst = src.with_suffix('.png')
    img = Image.open(src).convert('RGB')
    img.save(dst, 'PNG')
    print(dst)
