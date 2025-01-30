#!/bin/bash

# Set the API endpoint
API_URL="http://localhost:4000/api/auth/login"

echo -e "\n==============================="
echo -e "🚀 Running API tests for user login..."
echo -e "===============================\n"

# ✅ Test Case 1: Valid Login
echo -e "✅ TEST CASE 1: Valid Login\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "validuser@example.com",
           "password": "SecureP@ss123"
         }'
echo -e "\n🔹 Expected: 200 OK (Login successful, returns JWT token)"
echo -e "-------------------------------------\n"

# ❌ Test Case 2: Invalid Email
echo -e "❌ TEST CASE 2: Invalid Email\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "wronguser@example.com",
           "password": "SecureP@ss123"
         }'
echo -e "\n🔹 Expected: 401 Unauthorized (Invalid credentials)"
echo -e "-------------------------------------\n"

# ❌ Test Case 3: Incorrect Password
echo -e "❌ TEST CASE 3: Incorrect Password\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "validuser@example.com",
           "password": "WrongPassword"
         }'
echo -e "\n🔹 Expected: 401 Unauthorized (Invalid credentials)"
echo -e "-------------------------------------\n"

# ❌ Test Case 4: Missing Password Field
echo -e "❌ TEST CASE 4: Missing Password Field\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "validuser@example.com"
         }'
echo -e "\n🔹 Expected: 400 Bad Request (Missing password field)"
echo -e "-------------------------------------\n"

# ❌ Test Case 5: Empty Request Body
echo -e "❌ TEST CASE 5: Empty Request Body\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{}'
echo -e "\n🔹 Expected: 400 Bad Request (Missing email and password fields)"
echo -e "-------------------------------------\n"

echo -e "✅✅✅ ALL LOGIN TESTS COMPLETE ✅✅✅\n"
