#!/bin/bash

# Script to push the project to GitHub

# Set error handling
set -e

# Function to display help
show_help() {
  echo "Usage: ./github-push.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --help          Show this help message"
  echo ""
  echo "This script will push the project to GitHub."
  echo "Make sure you have Git installed and configured."
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Check if Git is installed
if ! command -v git &> /dev/null; then
  echo "Git is not installed. Please install Git and try again."
  exit 1
fi

# Check if we're in a Git repository
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
fi

# Check if the remote origin exists
if ! git remote | grep -q "origin"; then
  echo "Adding remote origin..."
  git remote add origin https://github.com/Zchasse63/vercelpickle.git
fi

# Rename the GitHub README file
if [ -f "GITHUB_README.md" ]; then
  echo "Renaming GITHUB_README.md to README.md for GitHub..."
  cp README.md PROJECT_README.md
  cp GITHUB_README.md README.md
fi

# Add all files to Git
echo "Adding files to Git..."
git add .

# Commit the changes
echo "Committing changes..."
git commit -m "Initial commit: Pickle B2B Marketplace"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

# Restore the original README
if [ -f "PROJECT_README.md" ]; then
  echo "Restoring original README.md..."
  mv PROJECT_README.md README.md
fi

echo "Project successfully pushed to GitHub!"
echo "GitHub repository: https://github.com/Zchasse63/vercelpickle"
