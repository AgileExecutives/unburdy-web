#!/bin/sh
# Replicate all environment variables present at build time into a .env file in the image
# Usage: Add this script to your Dockerfile and run it after setting envs/build args

set -e

ENV_FILE_PATH="/app/.env"

# Export all environment variables to .env file
printenv | awk -F= '{print $1 "=" $2}' > "$ENV_FILE_PATH"

# Show result for debug
cat "$ENV_FILE_PATH"
