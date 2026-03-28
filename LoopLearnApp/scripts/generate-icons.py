#!/usr/bin/env python3
"""Generate all app icon assets from the LoopLearn logo."""
from PIL import Image, ImageDraw
import numpy as np
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(BASE, "assets")

# Use the second logo (bolder)
src = Image.open(os.path.join(ASSETS, "Looplearn2png.png")).convert("RGBA")
print(f"Original size: {src.size}")

# Find the bounding box of non-white pixels
arr = np.array(src)
is_content = ~((arr[:,:,0] > 248) & (arr[:,:,1] > 248) & (arr[:,:,2] > 248))
rows = np.any(is_content, axis=1)
cols = np.any(is_content, axis=0)
rmin, rmax = np.where(rows)[0][[0, -1]]
cmin, cmax = np.where(cols)[0][[0, -1]]
print(f"Content bounds: top={rmin}, bottom={rmax}, left={cmin}, right={cmax}")

# Crop to content
cropped = src.crop((cmin, rmin, cmax + 1, rmax + 1))
print(f"Cropped size: {cropped.size}")

# Make it square by centering
w, h = cropped.size
side = max(w, h)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
offset_x = (side - w) // 2
offset_y = (side - h) // 2
square.paste(cropped, (offset_x, offset_y))
print(f"Square size: {square.size}")

# 1) icon.png - 1024x1024 for iOS App Store
icon_1024 = square.resize((1024, 1024), Image.LANCZOS)
icon_1024.save(os.path.join(ASSETS, "icon.png"))
print("Saved icon.png (1024x1024)")

# 2) splash-icon.png - 1024x1024
icon_1024.save(os.path.join(ASSETS, "splash-icon.png"))
print("Saved splash-icon.png (1024x1024)")

# 3) favicon.png - 48x48
icon_48 = square.resize((48, 48), Image.LANCZOS)
icon_48.save(os.path.join(ASSETS, "favicon.png"))
print("Saved favicon.png (48x48)")

# 4) Android foreground - 512x512 with adaptive icon safe zone padding
android_size = 512
fg = Image.new("RGBA", (android_size, android_size), (0, 0, 0, 0))
inner_size = int(android_size * 0.70)
icon_inner = square.resize((inner_size, inner_size), Image.LANCZOS)
offset = (android_size - inner_size) // 2
fg.paste(icon_inner, (offset, offset))
fg.save(os.path.join(ASSETS, "android-icon-foreground.png"))
print("Saved android-icon-foreground.png (512x512)")

# 5) Android background - gradient matching icon colors
bg = Image.new("RGB", (512, 512))
draw = ImageDraw.Draw(bg)
for y in range(512):
    ratio = y / 511
    if ratio < 0.33:
        r2 = ratio / 0.33
        r = int(0 + (99 - 0) * r2)
        g = int(212 + (102 - 212) * r2)
        b = int(255 + (241 - 255) * r2)
    elif ratio < 0.66:
        r2 = (ratio - 0.33) / 0.33
        r = int(99 + (139 - 99) * r2)
        g = int(102 + (92 - 102) * r2)
        b = int(241 + (246 - 241) * r2)
    else:
        r2 = (ratio - 0.66) / 0.34
        r = int(139 + (236 - 139) * r2)
        g = int(92 + (72 - 92) * r2)
        b = int(246 + (153 - 246) * r2)
    draw.line([(0, y), (511, y)], fill=(r, g, b))
bg.save(os.path.join(ASSETS, "android-icon-background.png"))
print("Saved android-icon-background.png (512x512)")

# 6) Monochrome icon
gray = square.convert("L").resize((512, 512), Image.LANCZOS)
gray.save(os.path.join(ASSETS, "android-icon-monochrome.png"))
print("Saved android-icon-monochrome.png (512x512)")

# 7) iOS Xcode asset - must be RGB (no alpha)
icon_rgb = Image.new("RGB", (1024, 1024), (99, 102, 241))
mask = icon_1024.split()[3]
icon_rgb.paste(icon_1024, mask=mask)
ios_path = os.path.join(BASE, "ios", "LoopLearn", "Images.xcassets",
                        "AppIcon.appiconset", "App-Icon-1024x1024@1x.png")
icon_rgb.save(ios_path)
print("Saved iOS AppIcon (1024x1024)")

print("\nAll icons generated successfully!")
