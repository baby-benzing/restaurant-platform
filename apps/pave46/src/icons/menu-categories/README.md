# Menu Category Icons

This folder contains all the React icon components used for menu categories on the website. All icons now use PNG images for better performance and consistency.

## Icon Files

- `ShowAllIcon.tsx` - Grid icon for showing all menu items
- `WineIcon.tsx` - Wine bottle and glass icon
- `BreadIcon.tsx` - Baguette icon
- `SandwichIcon.tsx` - Submarine sandwich icon
- `SoupSaladIcon.tsx` - Bowl with soup and salad
- `CroissantIcon.tsx` - Croissant for pastries
- `AfternoonIcon.tsx` - Coffee cup with sun for afternoon menu

## PNG Image Files Required

Each icon component requires a corresponding PNG file in the `/public/icons/` directory:

- `/public/icons/show-all.png` - For ShowAllIcon
- `/public/icons/wine.png` - For WineIcon
- `/public/icons/bread.png` - For BreadIcon
- `/public/icons/sandwich.png` - For SandwichIcon
- `/public/icons/soup-salad.png` - For SoupSaladIcon
- `/public/icons/croissant.png` - For CroissantIcon
- `/public/icons/afternoon.png` - For AfternoonIcon

**Note:** All PNG files should be placed in the `/public/icons/` directory, NOT in this component directory.

## How to Add New Icons

1. Create a PNG image file and place it in `/public/icons/[icon-name].png`
2. Create a new React component file in this folder (e.g., `NewIcon.tsx`):

```tsx
import Image from 'next/image';

export const NewIcon = () => (
  <div className="w-full h-full relative">
    <Image
      src="/icons/new-icon.png"
      alt="New icon"
      fill
      className="object-contain"
    />
  </div>
);
```

3. Add the export to `index.ts`:
```tsx
export { NewIcon } from './NewIcon';
```

4. Import and use in your component:
```tsx
import { NewIcon } from '@/icons/menu-categories';
```

## PNG Image Guidelines

- **Size**: Recommended 64x64px minimum, up to 128x128px for higher DPI displays
- **Format**: PNG with transparent background
- **Style**: Consistent visual style with existing icons
- **Colors**: Match the design system color palette
- **Naming**: Use kebab-case for filenames (e.g., `soup-salad.png`)

## Icon Component Structure

All icon components follow this pattern:

```tsx
import Image from 'next/image';

export const IconName = () => (
  <div className="w-full h-full relative">
    <Image
      src="/icons/icon-name.png"
      alt="Descriptive alt text"
      fill
      className="object-contain"
    />
  </div>
);
```

## Performance Benefits

- PNG images are cached by the browser
- Next.js Image component provides automatic optimization
- Consistent rendering across different browsers and devices
- Better performance than inline SVG for complex icons