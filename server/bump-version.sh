#!/bin/bash

#? Api-gateway

# cd to directory
cd api-gateway

# Read the current version
VERSION=$(cat VERSION)

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Bump patch
PATCH=$((PATCH + 1))

# Create new version
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "api-gateway version: $NEW_VERSION"

# cd to root
cd ..


#? Authentication

# cd to directory
cd authentication

# Read the current version
VERSION=$(cat VERSION)

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Bump patch
PATCH=$((PATCH + 1))

# Create new version
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "authentication version: $NEW_VERSION"

# cd to root
cd ..


#? Job

# cd to directory
cd job

# Read the current version
VERSION=$(cat VERSION)

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Bump patch
PATCH=$((PATCH + 1))

# Create new version
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "job version: $NEW_VERSION"

# cd to root
cd ..


#? Notification

# cd to directory
cd notification

# Read the current version
VERSION=$(cat VERSION)

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Bump patch
PATCH=$((PATCH + 1))

# Create new version
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "notification version: $NEW_VERSION"

# cd to root
cd ..


#? Problem

# cd to directory
cd problem

# Read the current version
VERSION=$(cat VERSION)

# Split version into parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Bump patch
PATCH=$((PATCH + 1))

# Create new version
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Save new version
echo "$NEW_VERSION" > VERSION

# Print new version
echo "problem version: $NEW_VERSION"

# cd to root
cd ..

