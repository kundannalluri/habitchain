import sqlalchemy
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()

def setup():
    # Get DATABASE_URL from .env
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL not found in .env")
        return

    # Extract base URL (without database name)
    from sqlalchemy.engine import make_url
    url = make_url(db_url)
    db_name = url.database
    
    # We need to connect to the server without a database first
    root_url = f"mysql+mysqlconnector://{url.username}{f':{url.password}' if url.password else ''}@{url.host}:{url.port}/"
    
    print(f"Connecting to MySQL server at {root_url}...")
    root_engine = create_engine(root_url)
    with root_engine.connect() as conn:
        conn.execute(sqlalchemy.text(f'CREATE DATABASE IF NOT EXISTS {db_name}'))
    
    print(f"Database '{db_name}' ensured.")
    
    # Now import Base and engine to create tables
    from database import Base, engine
    from models import User, Habit, Completion, Badge, UserBadge
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    setup()
