#!/bin/bash

# Define paths
BUILD_DIR="/var/www/html/public_path/static"
JS_DIR="$BUILD_DIR/js"
CSS_DIR="$BUILD_DIR/css"
PIXEL_LOADER_FILE="/var/www/html/public_path/pixel_loader.js"

# Find latest JS and CSS files
JS_FILE=$(ls $JS_DIR/main.*.js 2>/dev/null | head -n 1)
CSS_FILE=$(ls $CSS_DIR/main.*.css 2>/dev/null | head -n 1)

# Extract file names
JS_FILENAME=$(basename "$JS_FILE")
CSS_FILENAME=$(basename "$CSS_FILE")

# Check if files exist
if [[ -z "$JS_FILENAME" || -z "$CSS_FILENAME" ]]; then
  echo "Error: Could not find build static files."
  exit 1
fi

# Update pixel_loader.js file paths
sed -i -E "s|file:\"/static/js/main\..*\.js\"|file:\"/static/js/$JS_FILENAME\"|" $PIXEL_LOADER_FILE
sed -i -E "s|file:\"/static/css/main\..*\.css\"|file:\"/static/css/$CSS_FILENAME\"|" $PIXEL_LOADER_FILE

echo "Updated file paths in $PIXEL_LOADER_FILE"

