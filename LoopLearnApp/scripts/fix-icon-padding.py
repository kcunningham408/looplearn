"""
Fix LoopLearn app icons - remove white padding by extending the gradient
into the corners so iOS can cleanly apply its own rounded mask.
"""
from PIL import Image
import numpy as np
from scipy import ndimage
import os

ASSETS = '/Users/kevin/Desktop/KCStuff/Apps/LoopLearn/LoopLearnApp/assets'
SRC = os.path.join(ASSETS, 'Looplearn2png.png')

# ── Step 1: Load source and find exterior white mask via flood-fill ──

img = Image.open(SRC)
arr = np.array(img, dtype=np.float64)
h, w = arr.shape[:2]
print(f"Source: {w}x{h}")

# Create a binary mask of near-white pixels (>245 in all channels)
white_mask = (arr[:,:,0] > 245) & (arr[:,:,1] > 245) & (arr[:,:,2] > 245)

# Flood-fill from the 4 corners to find only EXTERIOR white pixels
# (avoids replacing white content inside the icon like the infinity symbol)
exterior = np.zeros_like(white_mask)
seed = np.zeros_like(white_mask)
seed[0, 0] = True
seed[0, w-1] = True
seed[h-1, 0] = True
seed[h-1, w-1] = True

# Iterative dilation constrained to white pixels = flood fill from corners
exterior = ndimage.binary_dilation(seed, iterations=0, mask=white_mask)
# binary_dilation with iterations=0 means "propagate until stable" = flood fill
print(f"Exterior white pixels: {exterior.sum()} ({100*exterior.sum()/(h*w):.1f}%)")

# ── Step 2: Create a matching 4-corner gradient background ──

# Sampled gradient colors at corners of the rounded rect:
# TL: (70, 134, 250) - blue
# TR: (136, 236, 244) - cyan  
# BL: (122, 73, 254) - purple
# BR: (252, 98, 201) - pink
TL = np.array([70, 134, 250], dtype=np.float64)
TR = np.array([136, 236, 244], dtype=np.float64)
BL = np.array([122, 73, 254], dtype=np.float64)
BR = np.array([252, 98, 201], dtype=np.float64)

# Bilinear interpolation
ys = np.linspace(0, 1, h).reshape(-1, 1, 1)
xs = np.linspace(0, 1, w).reshape(1, -1, 1)
gradient = (TL * (1-xs) * (1-ys) + TR * xs * (1-ys) +
            BL * (1-xs) * ys + BR * xs * ys)

# ── Step 3: Replace exterior white pixels with gradient ──

result = arr.copy()
result[exterior] = gradient[exterior]

# ── Step 4: Smooth the transition edge to avoid harsh border ──
# Dilate the exterior by a few pixels and blend at the boundary
from scipy.ndimage import distance_transform_edt
# Distance from interior (non-exterior) into exterior
dist = distance_transform_edt(exterior)
# Create a blending zone for pixels 1-4px into the exterior from the edge
blend_mask = (dist > 0) & (dist <= 4)
blend_factor = np.clip(dist / 4, 0, 1)

# In the blend zone, mix original and gradient
for c in range(3):
    orig = arr[:,:,c]
    grad = gradient[:,:,c]
    blended = orig * (1 - blend_factor) + grad * blend_factor
    channel = result[:,:,c]
    channel[blend_mask] = blended[blend_mask]
    result[:,:,c] = channel

result = np.clip(result, 0, 255).astype(np.uint8)

# ── Step 5: Save all icon variants ──

icon_1024 = Image.fromarray(result)

# iOS App Store icon (1024x1024 RGBA)
icon_1024.save(os.path.join(ASSETS, 'icon.png'))
print("✓ icon.png (1024x1024)")

# Splash icon (same as main icon)
icon_1024.save(os.path.join(ASSETS, 'splash-icon.png'))
print("✓ splash-icon.png (1024x1024)")

# Favicon (48x48)
icon_1024.resize((48, 48), Image.LANCZOS).save(os.path.join(ASSETS, 'favicon.png'))
print("✓ favicon.png (48x48)")

# Android adaptive icon background (just the gradient, 108x108 dp = 432px)
bg = Image.fromarray(np.clip(gradient, 0, 255).astype(np.uint8))
bg_432 = bg.resize((432, 432), Image.LANCZOS)
bg_432.save(os.path.join(ASSETS, 'android-icon-background.png'))
print("✓ android-icon-background.png (432x432)")

# Android adaptive icon foreground (content with transparent background)
# Convert to RGBA, make exterior transparent
rgba = np.zeros((h, w, 4), dtype=np.uint8)
rgba[:,:,:3] = result
rgba[:,:,3] = 255
# Don't make exterior transparent for foreground - keep full content
fg = Image.fromarray(rgba)
fg_432 = fg.resize((432, 432), Image.LANCZOS)
fg_432.save(os.path.join(ASSETS, 'android-icon-foreground.png'))
print("✓ android-icon-foreground.png (432x432)")

# Xcode icon (1024x1024 RGB - no alpha for App Store)
xcode_dir = '/Users/kevin/Desktop/KCStuff/Apps/LoopLearn/LoopLearnApp/ios/LoopLearn/Images.xcassets/AppIcon.appiconset'
icon_rgb = icon_1024.convert('RGB')
icon_rgb.save(os.path.join(xcode_dir, 'App-Icon-1024x1024@1x.png'))
print(f"✓ Xcode App-Icon-1024x1024@1x.png (1024x1024 RGB)")

print("\nAll icons updated successfully!")

