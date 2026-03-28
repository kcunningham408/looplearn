#!/usr/bin/env python3
"""
Generate App Store screenshots for LoopLearn.
Creates device-framed promotional screenshots for all required sizes:
  - iPhone 6.7" (1290x2796)
  - iPhone 6.5" (1284x2778)  
  - iPhone 5.5" (1242x2208)
  - iPad Pro 12.9" (2048x2732)
  - Mac (2880x1800)
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

# ─── Paths ───────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SCRIPT_DIR)
ASSETS = os.path.join(ROOT, 'assets')
ICON_PATH = os.path.join(ASSETS, 'icon.png')
OUT_DIR = os.path.join(ASSETS, 'screenshots')
os.makedirs(OUT_DIR, exist_ok=True)

# ─── Brand Colors ────────────────────────────────────────────────────────────
BG = (8, 10, 26)
BG_ELEVATED = (15, 18, 48)
CYAN = (6, 182, 212)
BLUE = (99, 102, 241)
PURPLE = (139, 92, 246)
PINK = (236, 72, 153)
GOLD = (252, 211, 77)
GREEN = (16, 185, 129)
ORANGE = (251, 146, 60)
WHITE = (255, 255, 255)
TEXT_SEC = (255, 255, 255, 184)
TEXT_MUTED = (255, 255, 255, 107)
MATH_BLUE = (59, 130, 246)
CORRECT_GREEN = (52, 211, 153)
CARD_BG = (15, 18, 48, 230)

# ─── Screenshot Specs ────────────────────────────────────────────────────────
DEVICE_SPECS = {
    'iphone_67': {'size': (1290, 2796), 'label': 'iPhone 6.7"', 'corner': 90, 'bezel': 30, 'notch': True},
    'iphone_65': {'size': (1284, 2778), 'label': 'iPhone 6.5"', 'corner': 88, 'bezel': 28, 'notch': True},
    'iphone_55': {'size': (1242, 2208), 'label': 'iPhone 5.5"', 'corner': 0, 'bezel': 24, 'notch': False},
    'ipad_129': {'size': (2048, 2732), 'label': 'iPad 12.9"', 'corner': 40, 'bezel': 20, 'notch': False},
    'mac': {'size': (2880, 1800), 'label': 'Mac', 'corner': 20, 'bezel': 0, 'notch': False},
}

# ─── 5 Screenshot Scenes ────────────────────────────────────────────────────
SCENES = [
    {
        'id': 'welcome',
        'headline': 'Learning\nis an Adventure!',
        'subtext': 'Math & Science for Grades 1-6',
        'badge': '🎓 AI-Powered',
    },
    {
        'id': 'subjects',
        'headline': 'Master Math\n& Science',
        'subtext': '66 Loops · 330 Lessons · 1650 Questions',
        'badge': '🔢🔬 Two Subjects',
    },
    {
        'id': 'quiz',
        'headline': 'AI-Generated\nQuiz Questions',
        'subtext': 'Fresh challenges every time you practice',
        'badge': '🤖 Powered by AI',
    },
    {
        'id': 'rewards',
        'headline': 'Earn Badges\n& Level Up!',
        'subtext': '33 Badges · XP System · Streak Rewards',
        'badge': '🏆 Gamified Learning',
    },
    {
        'id': 'progress',
        'headline': 'Track Your\nProgress',
        'subtext': 'Parent Dashboard · Progress Maps · Stats',
        'badge': '📊 Smart Tracking',
    },
]


def create_gradient(width, height, colors, vertical=True):
    """Create a gradient image from a list of RGB color tuples."""
    img = Image.new('RGBA', (width, height))
    draw = ImageDraw.Draw(img)
    
    n_segments = len(colors) - 1
    for i in range(n_segments):
        c1 = colors[i]
        c2 = colors[i + 1]
        if vertical:
            seg_start = int(height * i / n_segments)
            seg_end = int(height * (i + 1) / n_segments)
            for y in range(seg_start, seg_end):
                t = (y - seg_start) / max(1, seg_end - seg_start)
                r = int(c1[0] + (c2[0] - c1[0]) * t)
                g = int(c1[1] + (c2[1] - c1[1]) * t)
                b = int(c1[2] + (c2[2] - c1[2]) * t)
                draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        else:
            seg_start = int(width * i / n_segments)
            seg_end = int(width * (i + 1) / n_segments)
            for x in range(seg_start, seg_end):
                t = (x - seg_start) / max(1, seg_end - seg_start)
                r = int(c1[0] + (c2[0] - c1[0]) * t)
                g = int(c1[1] + (c2[1] - c1[1]) * t)
                b = int(c1[2] + (c2[2] - c1[2]) * t)
                draw.line([(x, 0), (x, height)], fill=(r, g, b, 255))
    return img


def rounded_rect(draw, xy, radius, fill):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def draw_glass_card(draw, xy, radius=24, fill=(15, 18, 48, 210), border_color=(255, 255, 255, 30)):
    """Draw a glass-morphism card."""
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)
    draw.rounded_rectangle(xy, radius=radius, outline=border_color, width=2)


def draw_glow(img, cx, cy, radius, color, alpha=60):
    """Draw a soft glow circle."""
    glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for r in range(radius, 0, -2):
        a = int(alpha * (r / radius) ** 0.5 * (1 - r / radius) ** 0.8)
        a = max(0, min(255, a))
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*color, a))
    img.alpha_composite(glow)


def get_font(size, bold=False):
    """Get system font."""
    font_paths = [
        '/System/Library/Fonts/SFPro-Bold.otf' if bold else '/System/Library/Fonts/SFPro-Regular.otf',
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/SFNS.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    return ImageFont.load_default()


def draw_phone_mockup(img, screen_img, cx, cy, phone_w, phone_h, corner_r=50):
    """Draw a simplified phone frame with a screen image inside."""
    bezel = int(phone_w * 0.04)
    
    # Phone body (dark frame)
    body_rect = [cx - phone_w // 2, cy - phone_h // 2, cx + phone_w // 2, cy + phone_h // 2]
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(body_rect, radius=corner_r, fill=(20, 20, 30, 255))
    draw.rounded_rectangle(body_rect, radius=corner_r, outline=(60, 60, 80, 200), width=3)
    
    # Screen area
    screen_rect = [
        body_rect[0] + bezel, body_rect[1] + bezel,
        body_rect[2] - bezel, body_rect[3] - bezel
    ]
    sw = screen_rect[2] - screen_rect[0]
    sh = screen_rect[3] - screen_rect[1]
    
    resized = screen_img.resize((sw, sh), Image.LANCZOS)
    img.paste(resized, (screen_rect[0], screen_rect[1]))


def create_app_screen(width, height, scene_id, icon_img):
    """Create a simulated app screen for a given scene."""
    screen = Image.new('RGBA', (width, height), BG + (255,))
    draw = ImageDraw.Draw(screen)
    
    pad = int(width * 0.06)
    
    if scene_id == 'welcome':
        # Show home screen with app logo and subject cards
        # Logo at top
        logo_size = int(width * 0.25)
        logo = icon_img.resize((logo_size, logo_size), Image.LANCZOS)
        lx = (width - logo_size) // 2
        ly = int(height * 0.08)
        screen.paste(logo, (lx, ly), logo)
        
        # "LoopLearn" title
        title_y = ly + logo_size + int(height * 0.02)
        font_title = get_font(int(width * 0.09), bold=True)
        text = "LoopLearn"
        bbox = draw.textbbox((0, 0), text, font=font_title)
        tw = bbox[2] - bbox[0]
        draw.text(((width - tw) // 2, title_y), text, fill=WHITE, font=font_title)
        
        # Tagline
        tag_y = title_y + int(height * 0.06)
        font_tag = get_font(int(width * 0.04))
        tag = "Learning is an adventure!"
        bbox = draw.textbbox((0, 0), tag, font=font_tag)
        tw = bbox[2] - bbox[0]
        draw.text(((width - tw) // 2, tag_y), tag, fill=(167, 139, 250, 255), font=font_tag)
        
        # Subject cards
        card_y = tag_y + int(height * 0.06)
        card_h = int(height * 0.12)
        card_w = width - pad * 2
        
        # Math card
        draw_glass_card(draw, (pad, card_y, pad + card_w, card_y + card_h), radius=20, fill=(14, 37, 80, 230))
        font_card = get_font(int(width * 0.065), bold=True)
        font_sub = get_font(int(width * 0.035))
        draw.text((pad + int(width * 0.18), card_y + int(card_h * 0.2)), "🔢 Math", fill=WHITE, font=font_card)
        draw.text((pad + int(width * 0.18), card_y + int(card_h * 0.55)), "Grades 1-6 · 33 Loops", fill=(255, 255, 255, 150), font=font_sub)
        
        # Science card
        card_y2 = card_y + card_h + int(height * 0.015)
        draw_glass_card(draw, (pad, card_y2, pad + card_w, card_y2 + card_h), radius=20, fill=(10, 53, 64, 230))
        draw.text((pad + int(width * 0.18), card_y2 + int(card_h * 0.2)), "🔬 Science", fill=WHITE, font=font_card)
        draw.text((pad + int(width * 0.18), card_y2 + int(card_h * 0.55)), "Grades 1-6 · 33 Loops", fill=(255, 255, 255, 150), font=font_sub)
        
        # AI Practice card
        card_y3 = card_y2 + card_h + int(height * 0.015)
        # Gradient stripe
        grad_h = card_h
        grad_card = create_gradient(card_w, grad_h, [CYAN, BLUE, PINK], vertical=False)
        # Darken it a bit
        dark = Image.new('RGBA', (card_w, grad_h), (0, 0, 0, 160))
        grad_card = Image.alpha_composite(grad_card, dark)
        screen.paste(grad_card, (pad, card_y3), grad_card)
        draw_glass_card(draw, (pad, card_y3, pad + card_w, card_y3 + card_h), radius=20, fill=(0, 0, 0, 0), border_color=(255, 255, 255, 50))
        draw.text((pad + int(width * 0.18), card_y3 + int(card_h * 0.2)), "🤖 AI Practice", fill=WHITE, font=font_card)
        draw.text((pad + int(width * 0.18), card_y3 + int(card_h * 0.55)), "Fresh AI-generated questions", fill=(255, 255, 255, 180), font=font_sub)
        
        # Stats row at bottom
        stats_y = card_y3 + card_h + int(height * 0.04)
        stat_w = (card_w - pad) // 3
        font_stat = get_font(int(width * 0.07), bold=True)
        font_stat_label = get_font(int(width * 0.03))
        
        stats = [("66", "Loops", CYAN), ("330", "Lessons", PURPLE), ("1650", "Questions", PINK)]
        for i, (val, label, color) in enumerate(stats):
            sx = pad + i * stat_w + stat_w // 2
            bbox = draw.textbbox((0, 0), val, font=font_stat)
            vw = bbox[2] - bbox[0]
            draw.text((sx - vw // 2, stats_y), val, fill=color, font=font_stat)
            bbox2 = draw.textbbox((0, 0), label, font=font_stat_label)
            lw = bbox2[2] - bbox2[0]
            draw.text((sx - lw // 2, stats_y + int(height * 0.045)), label, fill=(255, 255, 255, 120), font=font_stat_label)
    
    elif scene_id == 'subjects':
        # Show a subject home screen with lesson cards (loops)
        header_y = int(height * 0.05)
        font_h = get_font(int(width * 0.075), bold=True)
        draw.text((pad, header_y), "🔢 Math", fill=WHITE, font=font_h)
        
        font_grade = get_font(int(width * 0.045), bold=True)
        draw.text((pad, header_y + int(height * 0.06)), "Grade 3", fill=CYAN, font=font_grade)
        
        # Loop cards grid
        card_start_y = header_y + int(height * 0.11)
        card_h = int(height * 0.095)
        card_w = width - pad * 2
        gap = int(height * 0.012)
        
        loops = [
            ("Addition & Subtraction", "⭐ 5/5 Completed", CORRECT_GREEN, "➕"),
            ("Multiplication Basics", "⭐ 3/5 In Progress", GOLD, "✖️"),
            ("Division Foundations", "🔒 Locked", (255, 255, 255, 100), "➗"),
            ("Fractions Intro", "🔒 Locked", (255, 255, 255, 100), "🥧"),
            ("Geometry Basics", "🔒 Locked", (255, 255, 255, 100), "📐"),
            ("Word Problems", "🔒 Locked", (255, 255, 255, 100), "📝"),
        ]
        
        for i, (title, status, color, emoji) in enumerate(loops):
            cy = card_start_y + i * (card_h + gap)
            if cy + card_h > height - int(height * 0.05):
                break
            
            # Card with accent stripe
            draw_glass_card(draw, (pad, cy, pad + card_w, cy + card_h), radius=18, fill=(15, 18, 48, 220))
            
            # Left accent bar
            bar_color = color if isinstance(color, tuple) and len(color) == 3 else BLUE
            draw.rounded_rectangle((pad, cy, pad + 8, cy + card_h), radius=4, fill=bar_color + (200,) if len(bar_color) == 3 else bar_color)
            
            font_loop = get_font(int(width * 0.045), bold=True)
            font_status = get_font(int(width * 0.032))
            
            draw.text((pad + int(width * 0.14), cy + int(card_h * 0.2)), f"{emoji} {title}", fill=WHITE, font=font_loop)
            draw.text((pad + int(width * 0.14), cy + int(card_h * 0.58)), status, fill=color + (255,) if len(color) == 3 else color, font=font_status)
            
            # Progress bar
            if "Completed" in status:
                bar_y = cy + card_h - int(card_h * 0.15)
                draw.rounded_rectangle((pad + int(width * 0.14), bar_y, pad + card_w - pad, bar_y + 6), radius=3, fill=(255, 255, 255, 20))
                draw.rounded_rectangle((pad + int(width * 0.14), bar_y, pad + card_w - pad, bar_y + 6), radius=3, fill=CORRECT_GREEN + (200,))
            elif "Progress" in status:
                bar_y = cy + card_h - int(card_h * 0.15)
                bar_full = card_w - pad - int(width * 0.14)
                draw.rounded_rectangle((pad + int(width * 0.14), bar_y, pad + int(width * 0.14) + bar_full, bar_y + 6), radius=3, fill=(255, 255, 255, 20))
                draw.rounded_rectangle((pad + int(width * 0.14), bar_y, pad + int(width * 0.14) + int(bar_full * 0.6), bar_y + 6), radius=3, fill=GOLD + (200,))
    
    elif scene_id == 'quiz':
        # Show a quiz question screen
        header_y = int(height * 0.04)
        font_h = get_font(int(width * 0.055), bold=True)
        draw.text((pad, header_y), "🤖 AI Practice", fill=WHITE, font=font_h)
        
        # Progress bar
        prog_y = header_y + int(height * 0.05)
        draw.rounded_rectangle((pad, prog_y, width - pad, prog_y + 8), radius=4, fill=(255, 255, 255, 20))
        draw.rounded_rectangle((pad, prog_y, pad + int((width - pad * 2) * 0.6), prog_y + 8), radius=4, fill=CYAN + (255,))
        
        font_q_num = get_font(int(width * 0.035))
        draw.text((pad, prog_y + 16), "Q 3/5", fill=(255, 255, 255, 150), font=font_q_num)
        
        # Streak badge
        font_streak = get_font(int(width * 0.04), bold=True)
        draw.text((width - pad - int(width * 0.15), prog_y + 12), "🔥 3", fill=ORANGE, font=font_streak)
        
        # Question card
        q_y = prog_y + int(height * 0.06)
        q_h = int(height * 0.12)
        draw_glass_card(draw, (pad, q_y, width - pad, q_y + q_h), radius=24, fill=(15, 18, 48, 230))
        
        font_q = get_font(int(width * 0.05), bold=True)
        draw.text((pad + 24, q_y + int(q_h * 0.15)), "What is 3/4 + 1/2?", fill=WHITE, font=font_q)
        
        font_hint = get_font(int(width * 0.035))
        draw.text((pad + 24, q_y + int(q_h * 0.55)), "Grade 3 · Fractions", fill=(255, 255, 255, 120), font=font_hint)
        
        # Answer options
        ans_start = q_y + q_h + int(height * 0.025)
        ans_h = int(height * 0.065)
        ans_gap = int(height * 0.012)
        answers = [("A) 5/4", False, False), ("B) 1 1/4", True, True), ("C) 4/6", False, False), ("D) 1/1", False, False)]
        
        for i, (text, correct, selected) in enumerate(answers):
            ay = ans_start + i * (ans_h + ans_gap)
            if correct and selected:
                fill_color = (52, 211, 153, 40)
                border_color = CORRECT_GREEN + (200,)
            else:
                fill_color = (15, 18, 48, 200)
                border_color = (255, 255, 255, 30)
            
            draw.rounded_rectangle((pad, ay, width - pad, ay + ans_h), radius=16, fill=fill_color)
            draw.rounded_rectangle((pad, ay, width - pad, ay + ans_h), radius=16, outline=border_color, width=2)
            
            font_ans = get_font(int(width * 0.045), bold=correct)
            text_color = CORRECT_GREEN if correct and selected else WHITE
            draw.text((pad + 24, ay + int(ans_h * 0.25)), text, fill=text_color, font=font_ans)
            
            if correct and selected:
                draw.text((width - pad - 50, ay + int(ans_h * 0.2)), "✓", fill=CORRECT_GREEN, font=font_ans)
        
        # Correct feedback banner
        fb_y = ans_start + 4 * (ans_h + ans_gap) + int(height * 0.01)
        draw.rounded_rectangle((pad, fb_y, width - pad, fb_y + int(height * 0.06)), radius=16, fill=(52, 211, 153, 30))
        font_fb = get_font(int(width * 0.04), bold=True)
        draw.text((pad + 24, fb_y + int(height * 0.015)), "Correct! 🎉  +10 XP", fill=CORRECT_GREEN, font=font_fb)
    
    elif scene_id == 'rewards':
        # Rewards / badges screen
        header_y = int(height * 0.05)
        font_h = get_font(int(width * 0.07), bold=True)
        draw.text((pad, header_y), "🏆 Rewards", fill=WHITE, font=font_h)
        
        # Level card
        level_y = header_y + int(height * 0.07)
        level_h = int(height * 0.1)
        grad = create_gradient(width - pad * 2, level_h, [CYAN, PURPLE], vertical=False)
        dark = Image.new('RGBA', (width - pad * 2, level_h), (0, 0, 0, 100))
        grad = Image.alpha_composite(grad, dark)
        screen.paste(grad, (pad, level_y), grad)
        draw.rounded_rectangle((pad, level_y, width - pad, level_y + level_h), radius=20, outline=(255, 255, 255, 40), width=2)
        
        font_lvl = get_font(int(width * 0.09), bold=True)
        font_xp = get_font(int(width * 0.04))
        draw.text((pad + 24, level_y + int(level_h * 0.15)), "Level 7", fill=WHITE, font=font_lvl)
        draw.text((pad + 24, level_y + int(level_h * 0.6)), "1,250 / 2,000 XP", fill=(255, 255, 255, 200), font=font_xp)
        
        # XP bar
        bar_y = level_y + level_h - 16
        bar_w = width - pad * 2 - 48
        draw.rounded_rectangle((pad + 24, bar_y, pad + 24 + bar_w, bar_y + 8), radius=4, fill=(255, 255, 255, 30))
        draw.rounded_rectangle((pad + 24, bar_y, pad + 24 + int(bar_w * 0.625), bar_y + 8), radius=4, fill=GOLD + (255,))
        
        # Stats row
        stat_y = level_y + level_h + int(height * 0.025)
        stat_h = int(height * 0.065)
        stat_w_each = (width - pad * 2 - 20) // 3
        
        stat_data = [("🔥 12", "Day Streak"), ("⭐ 85%", "Accuracy"), ("📚 24", "Quizzes")]
        for i, (val, label) in enumerate(stat_data):
            sx = pad + i * (stat_w_each + 10)
            draw_glass_card(draw, (sx, stat_y, sx + stat_w_each, stat_y + stat_h), radius=14, fill=(15, 18, 48, 220))
            fv = get_font(int(width * 0.04), bold=True)
            fl = get_font(int(width * 0.025))
            bbox = draw.textbbox((0, 0), val, font=fv)
            vw = bbox[2] - bbox[0]
            draw.text((sx + (stat_w_each - vw) // 2, stat_y + int(stat_h * 0.15)), val, fill=WHITE, font=fv)
            bbox2 = draw.textbbox((0, 0), label, font=fl)
            lw2 = bbox2[2] - bbox2[0]
            draw.text((sx + (stat_w_each - lw2) // 2, stat_y + int(stat_h * 0.58)), label, fill=(255, 255, 255, 120), font=fl)
        
        # Badges grid
        badge_y = stat_y + stat_h + int(height * 0.03)
        font_badge_h = get_font(int(width * 0.04), bold=True)
        draw.text((pad, badge_y), "BADGES EARNED", fill=(255, 255, 255, 100), font=font_badge_h)
        
        badge_start = badge_y + int(height * 0.04)
        badge_size = int(width * 0.2)
        badge_gap = int(width * 0.04)
        cols = 4
        
        badges = [
            ("🌟", "First Star", True), ("🔥", "Hot Streak", True), ("🧮", "Math Whiz", True),
            ("🔬", "Scientist", True), ("🏅", "Champion", True), ("📚", "Bookworm", True),
            ("🎯", "Sharpshooter", True), ("💎", "Perfect", True), ("🦉", "Wise Owl", False),
            ("🚀", "Rocket", False), ("🌈", "Rainbow", False), ("👑", "Crown", False),
        ]
        
        for i, (emoji, name, earned) in enumerate(badges):
            row = i // cols
            col = i % cols
            bx = pad + col * (badge_size + badge_gap)
            by = badge_start + row * (badge_size + int(height * 0.01))
            
            if by + badge_size > height - int(height * 0.03):
                break
            
            if earned:
                draw_glass_card(draw, (bx, by, bx + badge_size, by + badge_size), radius=16, fill=(20, 22, 55, 230))
            else:
                draw_glass_card(draw, (bx, by, bx + badge_size, by + badge_size), radius=16, fill=(10, 12, 30, 200))
            
            fe = get_font(int(badge_size * 0.4))
            bbox = draw.textbbox((0, 0), emoji, font=fe)
            ew = bbox[2] - bbox[0]
            draw.text((bx + (badge_size - ew) // 2, by + int(badge_size * 0.1)), emoji, fill=WHITE if earned else (255, 255, 255, 60), font=fe)
            
            fn = get_font(int(badge_size * 0.15))
            bbox2 = draw.textbbox((0, 0), name, font=fn)
            nw = bbox2[2] - bbox2[0]
            draw.text((bx + (badge_size - nw) // 2, by + int(badge_size * 0.7)), name, fill=WHITE if earned else (255, 255, 255, 40), font=fn)
    
    elif scene_id == 'progress':
        # Parent dashboard / progress overview
        header_y = int(height * 0.05)
        font_h = get_font(int(width * 0.06), bold=True)
        draw.text((pad, header_y), "📊 Parent Dashboard", fill=WHITE, font=font_h)
        
        # Weekly summary card
        card_y = header_y + int(height * 0.07)
        card_h = int(height * 0.2)
        draw_glass_card(draw, (pad, card_y, width - pad, card_y + card_h), radius=24, fill=(15, 18, 48, 230))
        
        font_card_t = get_font(int(width * 0.04), bold=True)
        draw.text((pad + 24, card_y + 20), "THIS WEEK", fill=(255, 255, 255, 100), font=font_card_t)
        
        # Simple bar chart
        chart_y = card_y + int(card_h * 0.3)
        chart_h = int(card_h * 0.55)
        bar_w = int(width * 0.07)
        bar_gap = int(width * 0.04)
        days = ["M", "T", "W", "T", "F", "S", "S"]
        values = [0.4, 0.7, 0.5, 0.9, 0.6, 0.3, 0.8]
        colors_bars = [CYAN, BLUE, PURPLE, PINK, CYAN, BLUE, PURPLE]
        
        chart_x_start = pad + 40
        font_day = get_font(int(width * 0.03))
        
        for i, (day, val, color) in enumerate(zip(days, values, colors_bars)):
            bx = chart_x_start + i * (bar_w + bar_gap)
            bar_height = int(chart_h * val)
            bar_top = chart_y + chart_h - bar_height
            draw.rounded_rectangle((bx, bar_top, bx + bar_w, chart_y + chart_h), radius=6, fill=color + (200,))
            bbox = draw.textbbox((0, 0), day, font=font_day)
            dw = bbox[2] - bbox[0]
            draw.text((bx + (bar_w - dw) // 2, chart_y + chart_h + 8), day, fill=(255, 255, 255, 120), font=font_day)
        
        # Subject breakdown card
        sb_y = card_y + card_h + int(height * 0.02)
        sb_h = int(height * 0.13)
        draw_glass_card(draw, (pad, sb_y, width - pad, sb_y + sb_h), radius=20, fill=(15, 18, 48, 230))
        
        font_sb = get_font(int(width * 0.04), bold=True)
        font_pct = get_font(int(width * 0.06), bold=True)
        
        draw.text((pad + 24, sb_y + 16), "Math", fill=MATH_BLUE, font=font_sb)
        draw.text((pad + 24, sb_y + int(sb_h * 0.45)), "85% accuracy", fill=(255, 255, 255, 150), font=get_font(int(width * 0.035)))
        draw.text((width - pad - int(width * 0.18), sb_y + int(sb_h * 0.25)), "85%", fill=MATH_BLUE, font=font_pct)
        
        # Math progress bar
        mp_y = sb_y + sb_h - 16
        draw.rounded_rectangle((pad + 24, mp_y, width - pad - 24, mp_y + 6), radius=3, fill=(255, 255, 255, 20))
        draw.rounded_rectangle((pad + 24, mp_y, pad + 24 + int((width - pad * 2 - 48) * 0.85), mp_y + 6), radius=3, fill=MATH_BLUE + (200,))
        
        # Science card
        sc_y = sb_y + sb_h + int(height * 0.015)
        draw_glass_card(draw, (pad, sc_y, width - pad, sc_y + sb_h), radius=20, fill=(15, 18, 48, 230))
        draw.text((pad + 24, sc_y + 16), "Science", fill=GREEN, font=font_sb)
        draw.text((pad + 24, sc_y + int(sb_h * 0.45)), "78% accuracy", fill=(255, 255, 255, 150), font=get_font(int(width * 0.035)))
        draw.text((width - pad - int(width * 0.18), sc_y + int(sb_h * 0.25)), "78%", fill=GREEN, font=font_pct)
        
        sp_y = sc_y + sb_h - 16
        draw.rounded_rectangle((pad + 24, sp_y, width - pad - 24, sp_y + 6), radius=3, fill=(255, 255, 255, 20))
        draw.rounded_rectangle((pad + 24, sp_y, pad + 24 + int((width - pad * 2 - 48) * 0.78), sp_y + 6), radius=3, fill=GREEN + (200,))
        
        # Recent activity
        ra_y = sc_y + sb_h + int(height * 0.025)
        draw.text((pad, ra_y), "RECENT ACTIVITY", fill=(255, 255, 255, 100), font=font_card_t)
        
        activities = [
            ("Completed Multiplication Quiz", "Today · 90% · +45 XP", GOLD),
            ("Earned 🔥 Hot Streak Badge", "Yesterday · 7 Day Streak", ORANGE),
            ("Finished Plant Biology Loop", "2 days ago · 5/5 Links", GREEN),
        ]
        
        act_y = ra_y + int(height * 0.035)
        act_h = int(height * 0.055)
        font_act = get_font(int(width * 0.035), bold=True)
        font_act_sub = get_font(int(width * 0.028))
        
        for title, sub, color in activities:
            if act_y + act_h > height - int(height * 0.02):
                break
            draw_glass_card(draw, (pad, act_y, width - pad, act_y + act_h), radius=14, fill=(15, 18, 48, 200))
            draw.text((pad + 16, act_y + int(act_h * 0.15)), title, fill=WHITE, font=font_act)
            draw.text((pad + 16, act_y + int(act_h * 0.55)), sub, fill=color + (180,), font=font_act_sub)
            act_y += act_h + int(height * 0.01)
    
    return screen


def generate_screenshot(device_key, scene, icon_img):
    """Generate a single promotional screenshot."""
    spec = DEVICE_SPECS[device_key]
    w, h = spec['size']
    
    # Create background with gradient
    img = create_gradient(w, h, [BG, (12, 14, 35), BG], vertical=True)
    draw = ImageDraw.Draw(img)
    
    # Add subtle glow orbs
    draw_glow(img, int(w * 0.2), int(h * 0.15), int(w * 0.4), CYAN, alpha=25)
    draw_glow(img, int(w * 0.8), int(h * 0.4), int(w * 0.35), PURPLE, alpha=20)
    draw_glow(img, int(w * 0.5), int(h * 0.85), int(w * 0.3), PINK, alpha=15)
    
    # Determine layout proportions
    is_landscape = w > h  # Mac
    
    if is_landscape:
        # Mac layout: headline left, phone mockup right
        text_area_w = int(w * 0.45)
        mockup_area_x = int(w * 0.55)
        
        # Headline
        font_headline = get_font(int(w * 0.045), bold=True)
        headline_y = int(h * 0.2)
        for i, line in enumerate(scene['headline'].split('\n')):
            draw.text((int(w * 0.06), headline_y + i * int(h * 0.1)), line, fill=WHITE, font=font_headline)
        
        # Subtext  
        font_sub = get_font(int(w * 0.02))
        sub_y = headline_y + len(scene['headline'].split('\n')) * int(h * 0.1) + int(h * 0.03)
        draw.text((int(w * 0.06), sub_y), scene['subtext'], fill=(255, 255, 255, 160), font=font_sub)
        
        # Badge
        badge_y = sub_y + int(h * 0.06)
        font_badge = get_font(int(w * 0.016), bold=True)
        badge_text = scene['badge']
        bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
        bw = bbox[2] - bbox[0] + 40
        bh = bbox[3] - bbox[1] + 24
        draw.rounded_rectangle((int(w * 0.06), badge_y, int(w * 0.06) + bw, badge_y + bh), radius=bh // 2, fill=(139, 92, 246, 80))
        draw.rounded_rectangle((int(w * 0.06), badge_y, int(w * 0.06) + bw, badge_y + bh), radius=bh // 2, outline=(139, 92, 246, 160), width=2)
        draw.text((int(w * 0.06) + 20, badge_y + 10), badge_text, fill=WHITE, font=font_badge)
        
        # App icon + name
        icon_s = int(h * 0.08)
        icon_r = icon_img.resize((icon_s, icon_s), Image.LANCZOS)
        img.paste(icon_r, (int(w * 0.06), int(h * 0.78)), icon_r)
        font_brand = get_font(int(w * 0.022), bold=True)
        draw.text((int(w * 0.06) + icon_s + 16, int(h * 0.78) + icon_s // 4), "LoopLearn", fill=WHITE, font=font_brand)
        
        # Phone mockup on right
        phone_h_px = int(h * 0.75)
        phone_w_px = int(phone_h_px * 0.48)
        screen_img = create_app_screen(int(phone_w_px * 0.9), int(phone_h_px * 0.9), scene['id'], icon_img)
        mcx = mockup_area_x + int((w - mockup_area_x) * 0.5)
        mcy = int(h * 0.5)
        draw_phone_mockup(img, screen_img, mcx, mcy, phone_w_px, phone_h_px, corner_r=40)
    
    else:
        # Portrait layout: headline top, phone mockup center-bottom
        # Headline at top
        headline_y = int(h * 0.04)
        lines = scene['headline'].split('\n')
        font_headline = get_font(int(w * 0.1), bold=True)
        
        for i, line in enumerate(lines):
            bbox = draw.textbbox((0, 0), line, font=font_headline)
            tw = bbox[2] - bbox[0]
            draw.text(((w - tw) // 2, headline_y + i * int(h * 0.055)), line, fill=WHITE, font=font_headline)
        
        # Subtext
        sub_y = headline_y + len(lines) * int(h * 0.055) + int(h * 0.015)
        font_sub = get_font(int(w * 0.04))
        bbox = draw.textbbox((0, 0), scene['subtext'], font=font_sub)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) // 2, sub_y), scene['subtext'], fill=(255, 255, 255, 160), font=font_sub)
        
        # Badge pill
        badge_y = sub_y + int(h * 0.035)
        font_badge = get_font(int(w * 0.035), bold=True)
        badge_text = scene['badge']
        bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
        bw = bbox[2] - bbox[0] + 40
        bh = bbox[3] - bbox[1] + 20
        bx = (w - bw) // 2
        draw.rounded_rectangle((bx, badge_y, bx + bw, badge_y + bh), radius=bh // 2, fill=(139, 92, 246, 80))
        draw.rounded_rectangle((bx, badge_y, bx + bw, badge_y + bh), radius=bh // 2, outline=(139, 92, 246, 160), width=2)
        draw.text((bx + 20, badge_y + 8), badge_text, fill=WHITE, font=font_badge)
        
        # Phone mockup
        phone_area_top = badge_y + bh + int(h * 0.025)
        phone_area_h = h - phone_area_top - int(h * 0.01)
        phone_h_px = int(phone_area_h * 0.95)
        phone_w_px = int(phone_h_px * 0.48)
        
        # Limit phone width
        if phone_w_px > w * 0.85:
            phone_w_px = int(w * 0.85)
            phone_h_px = int(phone_w_px / 0.48)
        
        screen_img = create_app_screen(int(phone_w_px * 0.9), int(phone_h_px * 0.9), scene['id'], icon_img)
        mcx = w // 2
        mcy = phone_area_top + phone_area_h // 2
        draw_phone_mockup(img, screen_img, mcx, mcy, phone_w_px, phone_h_px, corner_r=spec['corner'])
    
    return img.convert('RGB')


def main():
    print("🖼️  LoopLearn Screenshot Generator")
    print("=" * 50)
    
    # Load icon
    icon_img = Image.open(ICON_PATH).convert('RGBA')
    print(f"✅ Loaded icon: {icon_img.size}")
    
    total = 0
    for device_key, spec in DEVICE_SPECS.items():
        device_dir = os.path.join(OUT_DIR, device_key)
        os.makedirs(device_dir, exist_ok=True)
        
        for i, scene in enumerate(SCENES):
            print(f"  Generating {spec['label']} - {scene['id']}...", end=' ')
            img = generate_screenshot(device_key, scene, icon_img)
            
            filename = f"{i + 1}_{scene['id']}.png"
            filepath = os.path.join(device_dir, filename)
            img.save(filepath, 'PNG', optimize=True)
            
            size_kb = os.path.getsize(filepath) / 1024
            print(f"✅ {img.size[0]}x{img.size[1]} ({size_kb:.0f}KB)")
            total += 1
    
    print(f"\n🎉 Generated {total} screenshots in {OUT_DIR}")
    print("\nDirectory structure:")
    for device_key in DEVICE_SPECS:
        device_dir = os.path.join(OUT_DIR, device_key)
        files = sorted(os.listdir(device_dir))
        print(f"  {device_key}/")
        for f in files:
            print(f"    {f}")


if __name__ == '__main__':
    main()
