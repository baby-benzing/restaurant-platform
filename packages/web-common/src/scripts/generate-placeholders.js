const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Generate placeholder images with text
function generatePlaceholder(width, height, text, bgColor, textColor, outputPath) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = textColor;
  ctx.font = `${Math.min(width, height) / 10}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Add dimensions
  ctx.font = `${Math.min(width, height) / 20}px sans-serif`;
  ctx.fillText(`${width}x${height}`, width / 2, height / 2 + Math.min(width, height) / 8);

  // Save to file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

// Placeholder configurations
const placeholders = [
  { name: 'hero.jpg', width: 1920, height: 1080, text: 'Hero Image', bg: '#1f2937', textColor: '#f3f4f6' },
  { name: 'food.jpg', width: 800, height: 600, text: 'Food', bg: '#fbbf24', textColor: '#78350f' },
  { name: 'interior.jpg', width: 800, height: 600, text: 'Interior', bg: '#60a5fa', textColor: '#1e3a8a' },
  { name: 'cocktail.jpg', width: 600, height: 800, text: 'Cocktail', bg: '#f472b6', textColor: '#831843' },
  { name: 'default.jpg', width: 600, height: 400, text: 'Image', bg: '#e5e7eb', textColor: '#374151' },
  { name: 'logo.png', width: 200, height: 200, text: 'Logo', bg: '#ffffff', textColor: '#000000' },
];

// Generate for each app
const apps = ['noreetuh', 'pave46'];

apps.forEach(app => {
  const placeholderDir = path.join(__dirname, '..', '..', '..', '..', 'apps', app, 'public', 'images', 'placeholder');
  
  // Ensure directory exists
  if (!fs.existsSync(placeholderDir)) {
    fs.mkdirSync(placeholderDir, { recursive: true });
  }

  // Generate each placeholder
  placeholders.forEach(config => {
    const outputPath = path.join(placeholderDir, config.name);
    generatePlaceholder(
      config.width,
      config.height,
      config.text,
      config.bg,
      config.textColor,
      outputPath
    );
  });
});

console.log('All placeholder images generated successfully!');