
echo "==========================================="
echo "🔍 [🦥 seat-sleuth 🦥] Performing Health Checks"
echo "==========================================="

sleep 2

echo -e "\nChecking server health at http://localhost:4000/api/health"
if curl -s --head --request GET http://localhost:4000/api/health | grep "200 OK" > /dev/null; then
  echo "Server is healthy and accessible at http://localhost:4000"
else
  echo "Server is NOT accessible! Check logs: docker-compose logs server"
fi


echo -e "\nChecking client health at http://localhost:5173"
if curl -s --head --request GET http://localhost:5173 | grep "200 OK" > /dev/null; then
  echo "Client is healthy and accessible at http://localhost:5173"
else
  echo "Client is NOT accessible! Check logs: docker-compose logs client"
fi


echo -e "\nChecking database health..."
if docker exec database pg_isready -U seat-sleuth-user -d seat-sleuth > /dev/null; then
  echo "Database is running and ready."
else
  echo "Database is NOT ready! Check logs: docker-compose logs database"
fi

echo -e "\n==========================================="
echo "[🦥 seat-sleuth 🦥] Health Check Completed"
echo "==========================================="
