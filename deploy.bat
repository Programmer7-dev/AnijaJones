@echo off
setlocal

title Deploy Anija Jones Portfolio

set "BRANCH=main"
set "REPO_URL=https://github.com/Programmer7-dev/AnijaJones.git"

echo.
echo ==========================================
echo   Anija Jones Portfolio Deployment
echo ==========================================
echo.

REM Create repo if needed
if not exist ".git" (
    echo [INFO] Initialising repository...
    git init

    git branch -M %BRANCH%

    git remote add origin %REPO_URL%
)

REM Ensure branch name
git branch -M %BRANCH%

REM Ensure remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin %REPO_URL%
)

echo [INFO] Staging files...
git add .

REM Create timestamp commit message
for /f "tokens=1-4 delims=/.- " %%a in ("%date%") do (
    set D1=%%a
    set D2=%%b
    set D3=%%c
)

set COMMITMSG=Website Update %date% %time%

git diff --cached --quiet

if errorlevel 1 (
    echo [INFO] Creating commit...
    git commit -m "%COMMITMSG%"
) else (
    echo [INFO] No new changes detected.
)

echo.
echo [INFO] Pushing to GitHub...
git push -u origin %BRANCH%

if errorlevel 1 (
    echo.
    echo [ERROR] Push failed.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Deployment Successful
echo ==========================================
echo.
echo Repository:
echo https://github.com/Programmer7-dev/AnijaJones
echo.
echo Website:
echo https://programmer7-dev.github.io/AnijaJones/
echo.
pause