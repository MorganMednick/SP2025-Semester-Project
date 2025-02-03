set -e

PROJECT_NAME="seat-sleuth"


remove_health_container() {
    local HEALTH_CONTAINER_ID=$(docker ps -aqf "name=health")
    if [ -n "$HEALTH_CONTAINER_ID" ]; then
        echo -e "\n🗑️  Removing old Health Check container (ID: $HEALTH_CONTAINER_ID)..."
        docker rm -f $HEALTH_CONTAINER_ID > /dev/null 2>&1
    else
        echo -e "\n✅ No existing Health Check container found."
    fi
}


cleanup_containers() {
    echo -e "\n🔻 Forcing removal of lingering containers...\n"
    docker ps -aq | xargs -r docker rm -f

    echo -e "\n🔻 Stopping and removing existing Docker containers...\n"
    docker-compose down -v --remove-orphans || true

    echo -e "\n🗑️  Removing unused volumes...\n"
    docker volume prune -f

    remove_health_container
}



start_containers() {
    echo -e "\n🦥 Starting Up Seat Sleuth Containers...\n"
    docker-compose -p "$PROJECT_NAME" up --build -d
}


wait_for_health_check() {
    local HEALTH_CONTAINER_ID=$(docker ps -aqf "name=health")
    if [ -n "$HEALTH_CONTAINER_ID" ]; then
        echo -e "\n🔥 Health Check Complete! All Services Healthy..."
        echo -e "\n🗑️  Removing Vestigial Health Check container for memory optimization (ID: $HEALTH_CONTAINER_ID)..."
        docker rm -f "$HEALTH_CONTAINER_ID" > /dev/null 2>&1
    fi
}


display_service_urls() {
    echo -e "\n🚀 Seat Sleuth is Up and Running! 🦥\n"
    echo -e "\t✅ Client:        http://localhost:5173"
    echo -e "\t✅ Server:        http://localhost:4000"
    echo -e "\t✅ Prisma Studio: http://localhost:5555\n"
}


cleanup_containers
start_containers
wait_for_health_check
display_service_urls
