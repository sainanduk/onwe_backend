#!/bin/bash

# Exit on any error
set -e

# Variables
SERVER_USER="ubuntu"
SERVER_IP="10.6.1.5"
SERVER_PATH="/home/ubuntu/"

# Transfer files to the server
scp -r ./build/* $SERVER_USER@$SERVER_IP:$SERVER_PATH

# Connect to the server and restart the application
ssh $SERVER_USER@$SERVER_IP << 'EOF'
  cd /path/to/deployment
  npm install --production
  pm2 restart app  # or however you manage your Node.js app
EOF
