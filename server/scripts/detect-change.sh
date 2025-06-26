#!/bin/bash

# Desired second-level directory to match
TARGET="k8s"

# Get list of changed files between remote and local
CHANGED_FILES=$(git diff --name-only origin/main HEAD)

# Flag to check if target is found
FOUND=false

# Loop through each file
while read -r file; do
  # Split path by /
  IFS='/' read -ra PARTS <<< "$file"

  # Check if second part matches the target
  if [[ "${PARTS[1]}" == "$TARGET" ]]; then
    echo "Match found: $file"
    FOUND=true
  fi
done <<< "$CHANGED_FILES"

# Optional: do something if match found
if $FOUND; then
  echo "Changes detected in $TARGET module."
else
  echo "No changes in $TARGET module."
fi
