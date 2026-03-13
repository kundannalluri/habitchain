@echo off
echo --- HabitChain: Starting Backend ---
cd /d "%~dp0"

echo [1/3] Ensuring virtual environment is active...
if not exist "venv" (
    echo Error: venv folder not found! Please make sure you are in the backend folder.
    pause
    exit /b
)

echo [2/3] Installing missing dependencies (if any)...
venv\Scripts\python.exe -m pip install email-validator pydantic[email]

echo [3/3] Launching Backend...
venv\Scripts\python.exe run.py

pause
