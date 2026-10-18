@echo off
setlocal

set "SITE_DIR=%~dp0"
set "REPO_URL=https://github.com/Programmer7-dev/AnijaJones.git"

echo Initializing repository...

if not exist "%SITE_DIR%.git" (
    git -C "%SITE_DIR%" init
)

git -C "%SITE_DIR%" remote remove origin 2>nul
git -C "%SITE_DIR%" remote add origin "%REPO_URL%"

git -C "%SITE_DIR%" add .

git -C "%SITE_DIR%" commit -m "Website update"

git -C "%SITE_DIR%" branch -M main

git -C "%SITE_DIR%" push -u origin main

pause
