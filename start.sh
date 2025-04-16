
#!/bin/bash
# This script ensures vite is available and runs it

echo "Starting Roots app..."
if [ ! -d "node_modules/.bin" ]; then
  echo "Installing dependencies first..."
  npm install
fi

echo "Running Vite development server..."
./node_modules/.bin/vite
