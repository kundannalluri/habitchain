from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, crud, auth, schemas

def seed():
    db = SessionLocal()
    try:
        # Check if test user exists
        test_user = crud.get_user_by_username(db, "kundan")
        if not test_user:
            print("Seeding test user...")
            test_user = models.User(
                username="kundan",
                email="kundan@example.com",
                hashed_password=crud.pwd_context.hash("123456"),
                points=450,
                level=4
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)

        # Check if habits exist
        if not db.query(models.Habit).filter(models.Habit.user_id == test_user.id).first():
            print("Seeding habits...")
            habits = [
                models.Habit(
                    user_id=test_user.id,
                    name="Drink Water",
                    description="Drink 8 glasses of water daily",
                    category="Health",
                    priority=models.Priority.HIGH,
                    frequency=models.Frequency.DAILY,
                    goal_value=8,
                    unit="glasses",
                    color="59, 130, 246",
                    icon="Droplet"
                ),
                models.Habit(
                    user_id=test_user.id,
                    name="Read Book",
                    description="Read for 30 minutes",
                    category="Growth",
                    priority=models.Priority.MEDIUM,
                    frequency=models.Frequency.DAILY,
                    goal_value=30,
                    unit="minutes",
                    color="16, 185, 129",
                    icon="Book"
                ),
                models.Habit(
                    user_id=test_user.id,
                    name="Morning Run",
                    description="30 minute morning run",
                    category="Fitness",
                    priority=models.Priority.HIGH,
                    frequency=models.Frequency.DAILY,
                    goal_value=30,
                    unit="minutes",
                    color="239, 68, 68",
                    icon="Activity"
                )
            ]
            db.add_all(habits)
            db.commit()
            
        # Seed Badges
        print("Seeding badges...")
        badges_to_seed = [
            {"name": "Early Adopter", "description": "Joined during the beta phase", "icon": "🚀", "criteria": {}},
            {"name": "Consistency King", "description": "Completed 7 days in a row", "icon": "👑", "criteria": {"streak": 7}},
            {"name": "First Step", "description": "Created your first habit", "icon": "🌱", "criteria": {"habits": 1}},
            {"name": "Habit Warrior", "description": "Successfully created 5 habits", "icon": "⚔️", "criteria": {"habits": 5}},
            {"name": "Novice", "description": "Reached Level 2", "icon": "⭐", "criteria": {"level": 2}},
            {"name": "Expert", "description": "Reached Level 5", "icon": "🏆", "criteria": {"level": 5}},
            {"name": "Master", "description": "Reached Level 10", "icon": "🔥", "criteria": {"level": 10}}
        ]
        
        for b_data in badges_to_seed:
            badge = db.query(models.Badge).filter(models.Badge.name == b_data["name"]).first()
            if not badge:
                badge = models.Badge(**b_data)
                db.add(badge)
        db.commit()

        # Assign initial badge to kundan if they don't have it
        if test_user:
            early_adopter = db.query(models.Badge).filter(models.Badge.name == "Early Adopter").first()
            if early_adopter:
                existing_ub = db.query(models.UserBadge).filter(
                    models.UserBadge.user_id == test_user.id, 
                    models.UserBadge.badge_id == early_adopter.id
                ).first()
                if not existing_ub:
                    user_badge = models.UserBadge(user_id=test_user.id, badge_id=early_adopter.id)
                    db.add(user_badge)
                    db.commit()

        print("Seed data applied successfully!")
    except Exception as e:
        print(f"Seed error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
