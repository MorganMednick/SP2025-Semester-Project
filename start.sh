#!/bin/bash

# Bring down any running containers and clean up Docker resources
echo "Bringing down Docker containers and cleaning up..."
docker-compose down
sleep 1

echo "Pruning Docker system..."
docker system prune -af --volumes
sleep 2


# Start Docker containers
echo "Starting Docker containers..."
docker-compose up --build -d

echo "Waiting for all services to be ready..."

# Loop until all services respond
while ! nc -z localhost 5173 || ! nc -z localhost 4000 || ! nc -z localhost 5432; do
  sleep 2
  echo "Still waiting for services..."
done

./run-scripts/health-check.sh
./run-scripts/prisma-studio.sh
