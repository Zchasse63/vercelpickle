#!/bin/bash

# Script to set up Convex for the Pickle B2B Marketplace
# Usage: ./scripts/setup-convex.sh

# Main directory
MAIN_DIR="/Users/zach/Desktop/Vercel Pickle"

# Check if npx is installed
if ! command -v npx &> /dev/null; then
  echo "Error: npx is not installed. Please install Node.js and npm."
  exit 1
fi

# Navigate to the project directory
cd "$MAIN_DIR" || exit 1

# Configure Convex with the provided credentials
echo "Setting up Convex..."
npx convex dev --configure=existing --team zchasse63 --project vo-pickle

echo "Convex setup complete!"
