#!/bin/bash

#? Api-gateway

#Checking existence
if [ ! -d "api-gateway" ]; then
    echo "Error: 'api-gateway' directory not found."
    exit 1
fi
cd api-gateway

#Checking existence
if [ ! -f "VERSION" ]; then
    echo "Error: 'VERSION' file not found in 'api-gateway' directory. Please create it with an initial version like 1.0.0"
    exit 1
fi

# Read the current version
VERSION=$(cat VERSION)

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format in VERSION file. Expected X.Y.Z (e.g., 1.0.0)."
    exit 1
fi

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Convert to integers for arithmetic
MAJOR=$((10#$MAJOR)) 
MINOR=$((10#$MINOR))
PATCH=$((10#$PATCH))

# Bump patch
PATCH=$((PATCH + 1))

# Check if patch rolls over
if [ "$PATCH" -ge 10 ]; then
    PATCH=0
    MINOR=$((MINOR + 1))
    # Check if minor rolls over
    if [ "$MINOR" -ge 10 ]; then
        MINOR=0
        MAJOR=$((MAJOR + 1))
    fi
fi

# Create new version string
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "api-gateway version: $NEW_VERSION"

# cd back to the root directory
cd ..


#? Authentication

#Checking existence
if [ ! -d "authentication" ]; then
    echo "Error: 'authentication' directory not found."
    exit 1
fi
cd authentication

#Checking existence
if [ ! -f "VERSION" ]; then
    echo "Error: 'VERSION' file not found in 'authentication' directory. Please create it with an initial version like 1.0.0"
    exit 1
fi

# Read the current version
VERSION=$(cat VERSION)

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format in VERSION file. Expected X.Y.Z (e.g., 1.0.0)."
    exit 1
fi

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Convert to integers for arithmetic
MAJOR=$((10#$MAJOR)) 
MINOR=$((10#$MINOR))
PATCH=$((10#$PATCH))

# Bump patch
PATCH=$((PATCH + 1))

# Check if patch rolls over
if [ "$PATCH" -ge 10 ]; then
    PATCH=0
    MINOR=$((MINOR + 1))
    # Check if minor rolls over
    if [ "$MINOR" -ge 10 ]; then
        MINOR=0
        MAJOR=$((MAJOR + 1))
    fi
fi

# Create new version string
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "authentication version: $NEW_VERSION"

# cd back to the root directory
cd ..


#? Job

#Checking existence
if [ ! -d "job" ]; then
    echo "Error: 'job' directory not found."
    exit 1
fi
cd job

#Checking existence
if [ ! -f "VERSION" ]; then
    echo "Error: 'VERSION' file not found in 'job' directory. Please create it with an initial version like 1.0.0"
    exit 1
fi

# Read the current version
VERSION=$(cat VERSION)

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format in VERSION file. Expected X.Y.Z (e.g., 1.0.0)."
    exit 1
fi

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Convert to integers for arithmetic
MAJOR=$((10#$MAJOR)) 
MINOR=$((10#$MINOR))
PATCH=$((10#$PATCH))

# Bump patch
PATCH=$((PATCH + 1))

# Check if patch rolls over
if [ "$PATCH" -ge 10 ]; then
    PATCH=0
    MINOR=$((MINOR + 1))
    # Check if minor rolls over
    if [ "$MINOR" -ge 10 ]; then
        MINOR=0
        MAJOR=$((MAJOR + 1))
    fi
fi

# Create new version string
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "job version: $NEW_VERSION"

# cd back to the root directory
cd ..


#? Notification

#Checking existence
if [ ! -d "notification" ]; then
    echo "Error: 'notification' directory not found."
    exit 1
fi
cd notification

#Checking existence
if [ ! -f "VERSION" ]; then
    echo "Error: 'VERSION' file not found in 'notification' directory. Please create it with an initial version like 1.0.0"
    exit 1
fi

# Read the current version
VERSION=$(cat VERSION)

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format in VERSION file. Expected X.Y.Z (e.g., 1.0.0)."
    exit 1
fi

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Convert to integers for arithmetic
MAJOR=$((10#$MAJOR)) 
MINOR=$((10#$MINOR))
PATCH=$((10#$PATCH))

# Bump patch
PATCH=$((PATCH + 1))

# Check if patch rolls over
if [ "$PATCH" -ge 10 ]; then
    PATCH=0
    MINOR=$((MINOR + 1))
    # Check if minor rolls over
    if [ "$MINOR" -ge 10 ]; then
        MINOR=0
        MAJOR=$((MAJOR + 1))
    fi
fi

# Create new version string
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "notification version: $NEW_VERSION"

# cd back to the root directory
cd ..


#? Problem

#Checking existence
if [ ! -d "problem" ]; then
    echo "Error: 'problem' directory not found."
    exit 1
fi
cd problem

#Checking existence
if [ ! -f "VERSION" ]; then
    echo "Error: 'VERSION' file not found in 'problem' directory. Please create it with an initial version like 1.0.0"
    exit 1
fi

# Read the current version
VERSION=$(cat VERSION)

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format in VERSION file. Expected X.Y.Z (e.g., 1.0.0)."
    exit 1
fi

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Convert to integers for arithmetic
MAJOR=$((10#$MAJOR)) 
MINOR=$((10#$MINOR))
PATCH=$((10#$PATCH))

# Bump patch
PATCH=$((PATCH + 1))

# Check if patch rolls over
if [ "$PATCH" -ge 10 ]; then
    PATCH=0
    MINOR=$((MINOR + 1))
    # Check if minor rolls over
    if [ "$MINOR" -ge 10 ]; then
        MINOR=0
        MAJOR=$((MAJOR + 1))
    fi
fi

# Create new version string
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "problem version: $NEW_VERSION"

# cd back to the root directory
cd ..

