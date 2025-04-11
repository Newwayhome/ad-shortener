@echo off
echo Setting up URL Shortener with Ad Monetization...

REM Create .env files if they don't exist
if not exist "server\.env" (
    echo Creating server .env file...
    copy "server\.env.example" "server\.env"
)

if not exist "client\.env" (
    echo Creating client .env file...
    echo REACT_APP_API_URL=http://localhost:5000/api > "client\.env"
)

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd server
call npm install
cd ..

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Start the backend server: cd server ^&^& npm run dev
echo 2. In a new terminal, start the frontend: cd client ^&^& npm start
echo.
echo Make sure to update the .env files with your configuration before starting the application.
pause 