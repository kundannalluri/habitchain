from datetime import date, timedelta
from sqlalchemy.orm import Session
import models

def calculate_streak(db: Session, habit_id: int) -> int:
    completions = db.query(models.Completion).filter(models.Completion.habit_id == habit_id).order_by(models.Completion.date.desc()).all()
    if not completions:
        return 0
    
    streak = 0
    current_date = date.today()
    
    # Check if completed today or yesterday
    if completions[0].date == current_date:
        streak = 1
        check_date = current_date - timedelta(days=1)
    elif completions[0].date == current_date - timedelta(days=1):
        streak = 1
        check_date = current_date - timedelta(days=2)
    else:
        return 0

    for completion in completions[1:]:
        if completion.date == check_date:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break
            
    return streak
