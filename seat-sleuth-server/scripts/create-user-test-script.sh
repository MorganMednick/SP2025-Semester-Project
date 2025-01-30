#!/bin/bash

# Set the API endpoint
API_URL="http://localhost:4000/api/auth/register"

echo -e "\n==============================="
echo -e "🚀 Running API tests for user creation..."
echo -e "===============================\n"


# ❌ Test Case 2: Invalid Email Format
echo -e "❌ TEST CASE 2: Invalid Email Format\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "invalid-email",
           "password": "SecureP@ss123"
         }'
echo -e "\n🔹 Expected: 400 Bad Request (Invalid email format)"
echo -e "-------------------------------------\n"

# ❌ Test Case 3: Password Too Short
echo -e "❌ TEST CASE 3: Password Too Short\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "shortpass@example.com",
           "password": "12345"
         }'
echo -e "\n🔹 Expected: 400 Bad Request (Password must be at least 8 characters long)"
echo -e "-------------------------------------\n"

# ❌ Test Case 4: Password Missing a Number
echo -e "❌ TEST CASE 4: Password Missing a Number\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "missingnumber@example.com",
           "password": "NoNumbersHere"
         }'
echo -e "\n🔹 Expected: 400 Bad Request (Password must contain at least one number)"
echo -e "-------------------------------------\n"

# ❌ Test Case 5: Duplicate Email
echo -e "❌ TEST CASE 5: Duplicate Email\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "validuser@example.com",
           "password": "SecureP@ss123"
         }'
echo -e "\n🔹 Expected: 409 Conflict (User already exists)"
echo -e "-------------------------------------\n"

# ❌ Test Case 6: Missing Password Field
echo -e "❌ TEST CASE 6: Missing Password Field\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "nopassword@example.com"
         }'
echo -e "\n🔹 Expected: 400 Bad Request (Missing password field)"
echo -e "-------------------------------------\n"

# ❌ Test Case 7: Empty Request Body
echo -e "❌ TEST CASE 7: Empty Request Body\n"
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d '{}'
echo -e "\n🔹 Expected: 400 Bad Request (Missing email and password fields)"
echo -e "-------------------------------------\n"

echo -e "✅✅✅ ALL USER CREATION TESTS COMPLETE ✅✅✅\n"
