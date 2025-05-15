#!/bin/bash

# Script to update the project checklist
# Usage: ./scripts/update-checklist.sh "Task description" "completed|incomplete"

# Check if all arguments were provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Error: Please provide a task description and status."
  echo "Usage: ./scripts/update-checklist.sh \"Task description\" \"completed|incomplete\""
  exit 1
fi

# Get the task description and status
TASK_DESC="$1"
TASK_STATUS="$2"

# Convert status to checkbox format
if [ "$TASK_STATUS" = "completed" ]; then
  CHECKBOX="[x]"
elif [ "$TASK_STATUS" = "incomplete" ]; then
  CHECKBOX="[ ]"
else
  echo "Error: Status must be either 'completed' or 'incomplete'."
  exit 1
fi

# Main directory
MAIN_DIR="/Users/zach/Desktop/Vercel Pickle"
CHECKLIST_FILE="${MAIN_DIR}/docs/PROJECT_CHECKLIST.md"

# Check if the checklist file exists
if [ ! -f "$CHECKLIST_FILE" ]; then
  echo "Error: Checklist file does not exist."
  exit 1
fi

# Create a temporary file
TEMP_FILE="${CHECKLIST_FILE}.tmp"

# Find and update the task in the checklist
if grep -q "- \[ \] $TASK_DESC" "$CHECKLIST_FILE"; then
  # Task exists and is incomplete
  sed "s/- \[ \] $TASK_DESC/- $CHECKBOX $TASK_DESC/" "$CHECKLIST_FILE" > "$TEMP_FILE"
  echo "Updated task: $TASK_DESC to $TASK_STATUS"
elif grep -q "- \[x\] $TASK_DESC" "$CHECKLIST_FILE"; then
  # Task exists and is complete
  sed "s/- \[x\] $TASK_DESC/- $CHECKBOX $TASK_DESC/" "$CHECKLIST_FILE" > "$TEMP_FILE"
  echo "Updated task: $TASK_DESC to $TASK_STATUS"
else
  # Task doesn't exist
  echo "Error: Task not found in checklist."
  echo "Please make sure the task description matches exactly."
  exit 1
fi

# Replace the original file
mv "$TEMP_FILE" "$CHECKLIST_FILE"

# Update timestamps
"${MAIN_DIR}/scripts/update-timestamps.sh"

echo "Checklist updated successfully!"
