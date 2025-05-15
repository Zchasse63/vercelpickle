#!/bin/bash

# Script to create a checkpoint in the project
# Usage: ./scripts/create-checkpoint.sh "Checkpoint description"

# Check if a description was provided
if [ -z "$1" ]; then
  echo "Error: Please provide a checkpoint description."
  echo "Usage: ./scripts/create-checkpoint.sh \"Checkpoint description\""
  exit 1
fi

# Get the current date and time
CURRENT_DATE=$(date +'%Y-%m-%d')
CURRENT_TIME=$(date +'%H:%M:%S')
CHECKPOINT_DESC="$1"

# Main directory
MAIN_DIR="/Users/zach/Desktop/Vercel Pickle"

# Create checkpoints directory if it doesn't exist
CHECKPOINTS_DIR="${MAIN_DIR}/checkpoints"
mkdir -p "$CHECKPOINTS_DIR"

# Create a checkpoint file
CHECKPOINT_FILE="${CHECKPOINTS_DIR}/checkpoint_${CURRENT_DATE}_${CURRENT_TIME//:/-}.md"

# Create the checkpoint content
cat > "$CHECKPOINT_FILE" << EOF
# Project Checkpoint: ${CURRENT_DATE} ${CURRENT_TIME}

## Description
${CHECKPOINT_DESC}

## Status Summary

### Completed Items
<!-- List items completed since the last checkpoint -->

### In Progress Items
<!-- List items currently in progress -->

### Upcoming Items
<!-- List items planned for the next phase -->

### Issues and Blockers
<!-- List any issues or blockers encountered -->

### Notes
<!-- Additional notes or observations -->

EOF

echo "Created checkpoint file: $CHECKPOINT_FILE"

# Update timestamps in project management documents
"${MAIN_DIR}/scripts/update-timestamps.sh"

echo "Checkpoint created successfully!"
