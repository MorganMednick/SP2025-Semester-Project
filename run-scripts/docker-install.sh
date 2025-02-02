#!/bin/bash

# Exit script on any error
set -e

echo "Updating Homebrew..."
brew update && brew upgrade

echo "Installing Docker..."
brew install --cask docker
echo "Docker installation complete."

echo "Installing Docker CLI..."
brew install docker
echo "Docker CLI installation complete."

echo "Installing Docker Compose..."
brew install docker-compose
echo "Docker Compose installation complete."

echo "Starting Docker Desktop..."
open -a Docker

echo "Waiting for Docker to start..."
while ! docker info &>/dev/null; do
  sleep 2
done
echo "Docker is up and running!"

echo "Installation completed successfully!"
