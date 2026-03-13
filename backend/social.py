from sqlalchemy.orm import Session
import models, schemas
from typing import List

def get_leaderboard(db: Session, limit: int = 10) -> List[models.User]:
    return db.query(models.User).order_by(models.User.points.desc()).limit(limit).all()

def get_user_stats(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    habits_count = db.query(models.Habit).filter(models.Habit.user_id == user_id).count()
    # Simplified stats for now
    return {
        "username": user.username,
        "points": user.points,
        "level": user.level,
        "habits_count": habits_count,
    }
