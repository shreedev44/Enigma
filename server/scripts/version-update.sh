#!/bin/bash

# Define list of modules
MODULES=("api-gateway" "authentication" "problem" "job" "notification")

# Get changed files between local and remote HEADs
CHANGED_FILES=$(git diff --name-only origin/main HEAD)

# Loop through each module
for MODULE in "${MODULES[@]}"; do
  # Check if any changed file belongs to this module
  MATCH=false
  while read -r file; do
    # Split by "/" and check if first part matches module name
    IFS='/' read -ra PARTS <<< "$file"
    if [[ "${PARTS[0]}" == "$MODULE" ]]; then
      MATCH=true
      break
    fi
  done <<< "$CHANGED_FILES"

  # If module has changed, bump version
  if $MATCH; then
    echo "🔁 Updating version for $MODULE..."
    if [ ! -d "$MODULE" ]; then
      echo "❌ Error: '$MODULE' directory not found."
      continue
    fi

    cd "$MODULE" || continue

    if [ ! -f "VERSION" ]; then
      echo "❌ Error: VERSION file missing in $MODULE. Please create it with an initial version like 1.0.0"
      cd ..
      continue
    fi

    VERSION=$(cat VERSION)

    if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "❌ Error: Invalid version format in $MODULE. Found '$VERSION'."
      cd ..
      continue
    fi

    IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"
    MAJOR=$((10#$MAJOR))
    MINOR=$((10#$MINOR))
    PATCH=$((10#$PATCH + 1))

    # Handle rollovers
    if [ "$PATCH" -ge 10 ]; then
      PATCH=0
      MINOR=$((MINOR + 1))
      if [ "$MINOR" -ge 10 ]; then
        MINOR=0
        MAJOR=$((MAJOR + 1))
      fi
    fi

    NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
    echo "$NEW_VERSION" > VERSION
    echo "✅ $MODULE version bumped to: $NEW_VERSION"

    cd ..

    DEPLOY_PATH="k8s/production/gcp/services/$MODULE/deployment.yaml"
    if [ -f "$DEPLOY_PATH" ]; then
      echo "📦 Updating image tag in $DEPLOY_PATH"
      sed -i -E "s|(image: .*/$MODULE:)(v?[0-9]+\.[0-9]+\.[0-9]+)|\1v$NEW_VERSION|" "$DEPLOY_PATH"
    else
      echo "⚠️ $DEPLOY_PATH not found. Skipping deployment update for $MODULE."
    fi
  else
    echo "🟢 No changes in $MODULE. Skipping version update."
  fi
done
