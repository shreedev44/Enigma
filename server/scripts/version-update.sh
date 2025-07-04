#!/bin/bash

# Define list of modules
MODULES=("api-gateway" "authentication" "problem" "job" "notification")

# Get changed files between local and remote HEADs
echo "🔍 Checking for changes between local HEAD and origin/main..."
CHANGED_FILES=$(git diff --name-only origin/main HEAD)

# Loop through each module
for MODULE in "${MODULES[@]}"; do
  echo ""
  echo "🔎 Checking module: $MODULE..."

  # Check if any changed file belongs to this module
  MATCH=false
  while read -r file; do
    if [[ "$file" == server/$MODULE/* ]]; then
      MATCH=true
      break
    fi
  done <<< "$CHANGED_FILES"

  # If module has changed, prompt for version bump
  if $MATCH; then
    echo "📝 Detected changes in $MODULE. Preparing to bump version..."

    MODULE_PATH="server/$MODULE"

    if [ ! -d "$MODULE_PATH" ]; then
      echo "❌ Error: '$MODULE_PATH' directory not found."
      continue
    fi

    cd "$MODULE_PATH" || continue

    if [ ! -f "VERSION" ]; then
      echo "❌ Error: VERSION file missing in $MODULE. Please create it with an initial version like 1.0.0"
      cd - > /dev/null
      continue
    fi

    VERSION=$(cat VERSION)

    if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "❌ Error: Invalid version format in $MODULE. Found '$VERSION'."
      cd - > /dev/null
      continue
    fi

    echo "📌 Current version of $MODULE: v$VERSION"
    echo -e "🚀 Specify the type of update for $MODULE:\n[1] Major \n[2] Minor \n[3] Patch"

    IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"
    MAJOR=$((10#$MAJOR))
    MINOR=$((10#$MINOR))
    PATCH=$((10#$PATCH))

    while true; do
      read -p "👉 Enter choice (1/2/3): " TYPE
      if [[ "$TYPE" == "1" ]]; then
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        break
      elif [[ "$TYPE" == "2" ]]; then
        MINOR=$((MINOR + 1))
        PATCH=0
        break
      elif [[ "$TYPE" == "3" ]]; then
        PATCH=$((PATCH + 1))
        break
      else
        echo "❗ Invalid choice. Please enter 1, 2, or 3."
      fi
    done

    NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
    echo "$NEW_VERSION" > VERSION
    echo "✅ Updated version of $MODULE: v$NEW_VERSION"

    cd - > /dev/null

    DEPLOY_PATH_GCP="server/k8s/production/gcp/services/$MODULE/deployment.yaml"
    DEPLOY_PATH_MKB="server/k8s/production/minikube/services/$MODULE/deployment.yaml"
    #Updating in gcp deployment
    if [ -f "$DEPLOY_PATH_GCP" ]; then
      echo "📦 Updating image tag in $DEPLOY_PATH_GCP"
      sed -i -E "s|(image:\s*.*enigma-$MODULE:)(v?[0-9]+\.[0-9]+\.[0-9]+)|\1v$NEW_VERSION|" "$DEPLOY_PATH_GCP"
      echo "✅ Image tag updated in deployment file."
    else
      echo "⚠️ Deployment file not found at $DEPLOY_PATH_GCP. Skipping image tag update."
    fi

    #Updating in minikube deployment
    if [ -f "$DEPLOY_PATH_MKB" ]; then
      echo "📦 Updating image tag in $DEPLOY_PATH_MKB"
      sed -i -E "s|(image:\s*.*enigma-$MODULE:)(v?[0-9]+\.[0-9]+\.[0-9]+)|\1v$NEW_VERSION|" "$DEPLOY_PATH_MKB"
      echo "✅ Image tag updated in deployment file."
    else
      echo "⚠️ Deployment file not found at $DEPLOY_PATH_MKB. Skipping image tag update."
    fi
  else
    echo "🟢 No changes detected in $MODULE. Skipping version update."
  fi
done

echo -e "\n🎉 Version update script completed!"
