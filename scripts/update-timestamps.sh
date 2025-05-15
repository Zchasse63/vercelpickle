#!/bin/bash

# Script to update timestamps in project management documents
# Usage: ./scripts/update-timestamps.sh

# Get the current date in YYYY-MM-DD format
CURRENT_DATE=$(date +'%Y-%m-%d')

# Function to update timestamp in a file
update_timestamp() {
  local file=$1
  local temp_file="${file}.tmp"

  # Check if file exists
  if [ ! -f "$file" ]; then
    echo "Error: File $file does not exist."
    return 1
  fi

  # Update the timestamp
  sed "s/\*\*Last Updated:\*\* \`.*\`/**Last Updated:** \`${CURRENT_DATE}\`/" "$file" > "$temp_file"

  # Replace the original file
  mv "$temp_file" "$file"

  echo "Updated timestamp in $file to $CURRENT_DATE"
}

# Main directory
MAIN_DIR="/Users/zach/Desktop/Vercel Pickle"

# Update timestamps in project management documents
update_timestamp "${MAIN_DIR}/docs/PROJECT_PLAN.md"
update_timestamp "${MAIN_DIR}/docs/PROJECT_CHECKLIST.md"
update_timestamp "${MAIN_DIR}/docs/FUTURE_PLANS.md"

echo "All timestamps updated successfully!"
