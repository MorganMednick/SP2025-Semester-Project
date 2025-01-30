#!/bin/bash

echo "Running all manual tests..."

# Run create-user tests first
echo "🔹 Running create-user-test-script.sh..."
./create-user-test-script.sh

# Run login-user tests after user creation
echo "🔹 Running login-user-test-script.sh..."
./login-user-test-script.sh

echo "✅ All manual tests completed!"
