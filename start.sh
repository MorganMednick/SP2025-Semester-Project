set -e


cleanup_containers() {
    echo -e "\nStopping and removing existing Docker containers...\n"
    docker-compose down -v --remove-orphans || true
    docker volume prune -f
}



start_containers() {
    echo -e "\nStarting Up Seat Sleuth Containers...\n"
    docker-compose up --build -d
}


wait_for_health_check() {
    local HEALTH_CONTAINER_ID=$(docker ps -aqf "name=health")
    if [ -n "$HEALTH_CONTAINER_ID" ]; then
        echo -e "\nHealth Check Complete! All Services Healthy..."
        echo -e "\nRemoving Vestigial Health Check container for memory optimization (ID: $HEALTH_CONTAINER_ID)..."
        docker rm -f "$HEALTH_CONTAINER_ID" > /dev/null 2>&1
    fi
}


display_service_urls() {
    echo -e "\tClient:        http://localhost:5173"
    echo -e "\tServer:        http://localhost:4000"
}

follow_logs() {
    docker-compose logs --follow
}


cleanup_containers
start_containers
wait_for_health_check
display_service_urls
follow_logs
