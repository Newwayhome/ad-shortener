#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Setting up URL Shortener with Ad Monetization...${NC}\n"

# Create .env files if they don't exist
if [ ! -f "server/.env" ]; then
    echo -e "${GREEN}Creating server .env file...${NC}"
    cp server/.env.example server/.env
fi

if [ ! -f "client/.env" ]; then
    echo -e "${GREEN}Creating client .env file...${NC}"
    echo "REACT_APP_API_URL=http://localhost:5000/api" > client/.env
fi

# Install backend dependencies
echo -e "\n${BLUE}Installing backend dependencies...${NC}"
cd server
npm install
cd ..

# Install frontend dependencies
echo -e "\n${BLUE}Installing frontend dependencies...${NC}"
cd client
npm install
cd ..

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "\nTo start the application:"
echo -e "1. Start the backend server: ${BLUE}cd server && npm run dev${NC}"
echo -e "2. In a new terminal, start the frontend: ${BLUE}cd client && npm start${NC}"
echo -e "\nMake sure to update the .env files with your configuration before starting the application." 