@echo off
echo ====================================
echo Pushing SEMO Project to GitHub
echo ====================================

cd /d "%~dp0"

echo.
echo [1/4] Adding files to Git...
git add .

echo.
echo [2/4] Creating commit...
git commit -m "Deploy: Update project files for Vercel and Render deployment"

echo.
echo [3/4] Ensuring main branch...
git branch -M main

echo.
echo [4/4] Pushing to GitHub...
git push -u origin main

echo.
echo ====================================
echo Done! Project pushed to GitHub
echo Repository: https://github.com/Ahmad-Ali-mohammad/semo-main
echo ====================================
echo.
pause
