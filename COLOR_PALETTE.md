# 🎨 Color Palette

## Brand Colors

The application uses a warm, inviting color palette inspired by soft pastels:

- **Peach Fuzz**: `#ffcdb2` - Light backgrounds, subtle accents
- **Powder Blush**: `#ffb4a2` - Mid-tone backgrounds, hover states
- **Cotton Candy**: `#e5989b` - Primary actions, gradients
- **Dusty Rose**: `#b5838d` - Primary buttons, text accents
- **Dim Grey**: `#6d6875` - Text, borders, secondary elements

## Usage

### Gradients

**Primary Gradient** (Buttons, CTAs):
```css
bg-gradient-to-r from-[#e5989b] to-[#b5838d]
/* Cotton Candy → Dusty Rose */
```

**Background Gradient** (Pages):
```css
bg-gradient-to-br from-[#ffcdb2] via-[#ffb4a2] to-[#e5989b]
/* Peach Fuzz → Powder Blush → Cotton Candy */
```

**Icon Gradient** (Brand Logo):
```css
bg-gradient-to-br from-[#e5989b] to-[#b5838d]
/* Cotton Candy → Dusty Rose */
```

### Color Applications

- **Primary Actions**: Cotton Candy to Dusty Rose gradient
- **Backgrounds**: Peach Fuzz to Powder Blush gradient
- **Text Accents**: Dusty Rose for emphasis
- **Icons**: Dusty Rose, Cotton Candy, Powder Blush
- **Hover States**: Darker shades of primary colors

## Custom CSS Variables

Defined in `src/app/globals.css`:

```css
--color-peach-fuzz: #ffcdb2;
--color-powder-blush: #ffb4a2;
--color-cotton-candy: #e5989b;
--color-dusty-rose: #b5838d;
--color-dim-grey: #6d6875;
```

## Updated Components

All components have been updated to use the new palette:

- ✅ Brand Header
- ✅ Auth Layout
- ✅ Login Form
- ✅ Forgot Password Form
- ✅ Reset Password Form
- ✅ Landing Page
- ✅ Dashboard
- ✅ Chat Interface
- ✅ Curriculum Selector

## Design Philosophy

The warm, soft palette creates a welcoming and approachable learning environment, perfect for an educational application targeting Kenyan students. The colors evoke:

- **Warmth**: Inviting and friendly
- **Calm**: Soothing learning environment
- **Modern**: Contemporary and fresh
- **Cultural**: Warm tones that resonate with African aesthetics



