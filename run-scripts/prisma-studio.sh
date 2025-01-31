echo "Opening Prisma Studio shell for your use in the postrges volume:"
docker-compose exec -d server npx prisma studio
sleep 1
echo "Prisma Client available at http://localhost:5555"
