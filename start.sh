echo -e "\n🔻 Bringing down existing Docker containers and cleaning up...\n"
docker-compose down -v --remove-orphans

# Remove old health-check container if it exists
HEALTH_CONTAINER_ID=$(docker ps -aqf "name=health")
if [ -n "$HEALTH_CONTAINER_ID" ]; then
    echo -e "\n🗑️  Removing old Health Check container (ID: $HEALTH_CONTAINER_ID)..."
    docker rm -f $HEALTH_CONTAINER_ID
else
    echo -e "\n✅ No existing Health Check container found."
fi

echo -e "\n🦥 Starting Up Seat Sleuth Containers...\n"
docker-compose up --build -d


echo -e "🛠️ Opening Prisma Studio in the PostgreSQL volume...\n"
docker-compose exec -d server npx prisma studio
echo "🌐 Prisma Studio is now live!"

HEALTH_CONTAINER_ID=$(docker ps -aqf "name=health")
if [ -n "$HEALTH_CONTAINER_ID" ]; then
    echo -e "\n🔥 Health Check Complete! All Services Healthy..."
    echo -e "\n🗑️  Removing Vestigial Health Check container for memory optimization (ID: $HEALTH_CONTAINER_ID)..."
    docker rm -f $HEALTH_CONTAINER_ID > /dev/null 2>&1
fi

echo -e "\n🚀 Seat Sleuth is Up and Running! 🦥\n"

echo -e "\t✅ Client:        http://localhost:5173"
echo -e "\t✅ Server:        http://localhost:4000"
echo -e "\t✅ Prisma Studio: http://localhost:5555\n"
