@echo off
setlocal enabledelayedexpansion

:: Check if Node.js is available
where node >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js not found!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

:: Run the deployment script
echo Running automatic deployment...
echo.
node "%~dp0auto-deploy.js"

endlocal
