import subprocess
import sys

def install_deps():
    try:
        import email_validator
    except ImportError:
        print("Installing missing dependencies (email-validator)...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "email-validator", "pydantic[email]"])

if __name__ == "__main__":
    install_deps()
    import uvicorn
    import setup_db
    import seed_data
    print("--- HabitChain Backend: Initializing Database ---")
    try:
        setup_db.setup()
        print("--- HabitChain Backend: Seeding Initial Data ---")
        seed_data.seed()
    except Exception as e:
        print(f"Warning: Initialization encountered an issue: {e}")
        print("Attempting to start server anyway...")

    print("\n--- HabitChain Backend: Starting Server ---")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
