# ONV - Upcycled Metal Furniture Brand Website

## Brand
- **Name:** ONV
- **Concept:** 재생된 금속으로 만드는 업사이클링 가구 브랜드
- **Tagline:** "Recycled Metal Into Furniture" / "ONV Adds Depth To Your Space"
- **Overview:** 재생된 금속이 지닌 고유의 물성을 담아낸 가구 브랜드. 지속가능성과 메탈릭 감각이 공존하는 새로운 가구를 제안. 금속 본연의 질감과 빛을 간직하여 절제된 형태, 그리고 금속 소재의 순환을 통해 환경적 가치와 디자인의 균형을 찾습니다.
- **Core Values:** 환경 / 연결 / 금속
- **English tagline:** "The brand core values that ONV conveys achieve a balance in design where the refined beauty of metal meets genuine environmental consciousness."

## Design Direction
- **Mood:** Industrial-minimalist luxury, dark theme (black background), high-end gallery feel
- **Colors:** 
  - Primary background: Pure black (#000000) to dark charcoal
  - Text: White (#FFFFFF)
  - Accents: Muted gray, metallic silver
  - Borders: Dotted white/gray lines
- **Typography:** Clean geometric sans-serif (use "Inter" or "Outfit" as web font). Uppercase headings with generous letter-spacing.
- **Logo:** "ONV" text logo - use the logo image from img_source/logo.jpg

## Pages (Multi-page site)

### 1. HOME (index.html) - Dark theme
- Header: ONV logo (left) + Navigation SHOP | BRAND | CONTACT (right)
- Hero: Large main product image (main.png) centered on the page
- Shop preview section: "SHOP" heading with dotted underline, show 3 featured products in a grid
- "VIEW ALL PRODUCTS" button with dotted border → links to shop page
- Footer: Large semi-transparent ONV watermark logo, copyright "© 2025 ONV. All rights reserved.", footer nav

### 2. SHOP (shop.html) - White/light theme
- Header same nav
- Hero: Same main product image at top
- Product sections organized by category with "SHOP" heading, Material/Year metadata
- Categories: Chair, Table, Light, Drawer, Shelves, Display Cabinet
- **3-column product grid**
- **HOVER INTERACTION:** Products that have a "-2" variant image show the alternate on hover
  - chair_01.png → hover: chair_01-2.png ✓
  - chair_02.png → hover: chair_02-2.jpg ✓
  - chair_03.png → hover: chair_03-2.jpg ✓
  - chair_04.png → hover: chair_04-2.jpg ✓
  - chair_05.png → hover: chair_05-4.jpg ✓
  - drawer_01.png → hover: drawer_01-2.png ✓
  - All others: no hover variant
- Footer same as home but dark

### 3. BRAND (brand.html) - Dark theme with grunge texture
- Header same nav
- Hero section with dark grunge/scratched metal texture background
- Large distressed stencil-style typography: "RECYCLED METAL" 
- "ONV ADDS DEPTH" headline
- Scattered text elements: "TO YOUR SPACE" / "INTO FURNITURE"
- Brand story text from the overview/core values content
- Design concept explanation
- Footer same

### 4. CONTACT (contact.html) - Dark theme
- Header same nav
- "CONTACT" page title in muted gray
- Dotted horizontal divider
- Contact info stacked vertically:
  - Email: info@onv.design / press@onv.design
  - Address: 123, Teheran-ro, Gangnam-gu, Seoul, Republic of Korea
  - Working Hours: Mon-Fri 10:00-18:00 (KST), Sat/Sun/Hol Closed
  - Socials: @onv_official
- Footer same

## Key Interactions
1. **Page transitions:** When navigating from HOME to other pages, the current page darkens and the new page slides in horizontally from the right. Use smooth CSS transitions/JS animations.
2. **Product hover:** On shop page, products with -2 variants swap image on mouse hover with a smooth transition (crossfade or scale effect).
3. **Smooth scrolling** throughout
4. **Subtle animations** on scroll (fade-in elements)

## File Structure
All images are in:
- `img_shop/` - Product images
- `img_source/` - Logo and brand text images
- `layout/` - Reference mockups (don't use in final site)

## Tech Stack
- Pure HTML, CSS, JavaScript (no frameworks)
- Single folder deployment
- Responsive but desktop-first

## IMPORTANT
- The nav should say "CONTACT" (not "CONTANCT" which was a typo in the mockup)
- Use actual product images from img_shop/
- Make the site feel premium and gallery-like
- The page transition effect is KEY: darkening overlay + horizontal slide
