set -e

echo -e "\nStopping and removing existing Docker containers...\n"
docker-compose down -v --remove-orphans || true
docker system prune -af
docker system prune -af --volumes
