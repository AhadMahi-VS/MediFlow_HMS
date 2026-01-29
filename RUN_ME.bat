@echo off
TITLE MediFlow - Auto Launcher
COLOR 0A

echo ==================================================
echo      STARTING MEDIFLOW SYSTEM (Please Wait...)
echo ==================================================
echo.

echo 1. Make sure XAMPP MySQL is GREEN!
timeout /t 3 >nul

echo.
echo 2. Installing Python Requirements...
pip install -r requirements.txt

echo.
echo 3. Setting up Database...
python manage.py makemigrations
python manage.py migrate

echo.
echo 4. Starting Server & Opening Website...
start "" "client\index.html"
python manage.py runserver

pause