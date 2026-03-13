from database import SessionLocal
import models

def seed_badges():
    db = SessionLocal()
    try:
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
                print(f"Adding badge: {b_data['name']}")
                badge = models.Badge(**b_data)
                db.add(badge)
            else:
                print(f"Badge already exists: {b_data['name']}")
                # Update icon/description if needed
                badge.icon = b_data["icon"]
                badge.description = b_data["description"]
                badge.criteria = b_data["criteria"]
                
        db.commit()
        print("Badges seeded successfully!")
    except Exception as e:
        print(f"Error seeding badges: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_badges()
