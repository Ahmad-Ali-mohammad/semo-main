@echo off
chcp 65001 >nul
echo ====================================
echo Pushing SEMO Project to GitHub
echo ====================================

cd /d "%~dp0"

echo.
echo [1/4] Adding files to Git...
git add .
if errorlevel 1 (
    echo Error adding files!
    pause
    exit /b 1
)

echo.
echo [2/4] Creating commit...
git commit -m "Ready for deployment - Added deployment files and documentation"
if errorlevel 1 (
    echo Note: Nothing to commit or error occurred
)

echo.
echo [3/4] Ensuring main branch...
git branch -M main

echo.
echo [4/4] Pushing to GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo Error pushing to GitHub!
    echo.
    echo Possible solutions:
    echo 1. Make sure you're logged in to GitHub
    echo 2. Use Personal Access Token instead of password
    echo 3. Get token from: https://github.com/settings/tokens
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo ✅ Success! Project pushed to GitHub
echo Repository: https://github.com/Ahmad-Ali-mohammad/semo-main
echo ====================================
echo.
echo Next steps:
echo 1. Deploy Backend on Render: https://render.com
echo 2. Deploy Frontend on Vercel: https://vercel.com
echo 3. See QUICK_DEPLOY.md for detailed instructions
echo.
pause
