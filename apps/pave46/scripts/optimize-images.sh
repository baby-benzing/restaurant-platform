#!/bin/bash

# Script to optimize images for Pavé46 website
# This creates higher quality versions of the restaurant images

IMAGE_DIR="../public/images/restaurant"

echo "🖼️  Optimizing restaurant images..."

# Create backup directory
if [ ! -d "$IMAGE_DIR/backup" ]; then
  mkdir -p "$IMAGE_DIR/backup"
  echo "📁 Created backup directory"
fi

# Backup existing images
cp "$IMAGE_DIR"/*.jpg "$IMAGE_DIR/backup/" 2>/dev/null

# Resize images to higher quality
# Target sizes:
# - Hero/feature images: 1920x1080
# - Gallery images: 1200x800
# - Thumbnail images: 800x600

echo "📐 Resizing images to higher quality..."

# Check if we have sips (macOS tool)
if command -v sips &> /dev/null; then
  # Resize existing images to higher quality
  for img in "$IMAGE_DIR"/*.jpg; do
    if [ -f "$img" ]; then
      filename=$(basename "$img")
      echo "  Processing $filename..."
      
      # Create a high-quality version (double the current size as a start)
      sips -Z 1920 "$img" --out "$IMAGE_DIR/temp_$filename"
      
      # Apply quality settings
      sips -s format jpeg -s formatOptions 85 "$IMAGE_DIR/temp_$filename" --out "$img"
      
      # Clean up temp file
      rm "$IMAGE_DIR/temp_$filename"
    fi
  done
  
  echo "✅ Images optimized!"
else
  echo "⚠️  sips not found. Please install macOS developer tools or use another image optimization tool."
fi

echo ""
echo "📊 Image sizes after optimization:"
for img in "$IMAGE_DIR"/*.jpg; do
  if [ -f "$img" ]; then
    filename=$(basename "$img")
    dimensions=$(sips -g pixelWidth -g pixelHeight "$img" | tail -2 | awk '{print $2}' | tr '\n' 'x' | sed 's/x$//')
    size=$(ls -lh "$img" | awk '{print $5}')
    echo "  $filename: $dimensions ($size)"
  fi
done

echo ""
echo "💡 Tips for better image quality:"
echo "  1. Export HEIC files from Photos app as JPEG with high quality"
echo "  2. Use Image Capture app to import from iPhone with original quality"
echo "  3. Place high-res images in $IMAGE_DIR and run this script again"