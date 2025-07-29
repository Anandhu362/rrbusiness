#!/bin/bash

# Set your website directory here (adjust as needed)
WEB_DIR="/var/www/html"

echo "🔍 Scanning directory: $WEB_DIR"

# Install required tools if missing
echo "📦 Installing optimization tools..."
sudo apt update
sudo apt install -y jpegoptim optipng webp ffmpeg

cd "$WEB_DIR" || { echo "❌ Directory not found: $WEB_DIR"; exit 1; }

# Backup folder
BACKUP_DIR="$WEB_DIR/_backup_assets_$(date +%s)"
mkdir -p "$BACKUP_DIR"

# 1. Backup and compress JPEGs
echo "🖼️ Compressing JPEG files..."
find . -iname '*.jpg' -or -iname '*.jpeg' | while read -r file; do
  cp "$file" "$BACKUP_DIR"
  jpegoptim --max=70 --strip-all "$file"
done

# 2. Backup and compress PNGs
echo "🖼️ Compressing PNG files..."
find . -iname '*.png' | while read -r file; do
  cp "$file" "$BACKUP_DIR"
  optipng -o7 "$file"
done

# 3. Convert to WebP (optional, keeps original)
echo "🖼️ Converting images to WebP..."
find . -iname '*.jpg' -or -iname '*.png' | while read -r file; do
  cwebp -q 75 "$file" -o "${file%.*}.webp"
done

# 4. Compress MP4 videos
echo "🎞️ Compressing MP4 videos..."
find . -iname '*.mp4' | while read -r file; do
  cp "$file" "$BACKUP_DIR"
  ffmpeg -i "$file" -vcodec libx264 -crf 28 -preset slow "${file%.*}_compressed.mp4" -y
  mv "${file%.*}_compressed.mp4" "$file"
done

echo "✅ Optimization complete!"
echo "🗂️ Backup of original files saved in: $BACKUP_DIR"
