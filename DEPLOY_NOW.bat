@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🚀 Starting Automatic Deployment 🚀              ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo هذا سيقوم برفع المشروع على GitHub تلقائياً...
echo.

node auto-deploy.js

if errorlevel 1 (
    echo.
    echo ❌ فشل الرفع التلقائي
    echo.
    echo جرب يدوياً:
    echo   git add .
    echo   git commit -m "Deploy"
    echo   git push -u origin main
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo ✅ تم رفع المشروع على GitHub بنجاح!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📋 الخطوات التالية:
echo.
echo 1. نشر Backend على Render:
echo    https://render.com
echo.
echo 2. نشر Frontend على Vercel:
echo    https://vercel.com
echo.
echo 3. راجع التعليمات التفصيلية:
echo    QUICK_DEPLOY.md
echo.
echo هل تريد فتح دليل النشر السريع؟ (Y/N)
set /p choice=

if /i "%choice%"=="Y" (
    start QUICK_DEPLOY.md
)

echo.
pause
