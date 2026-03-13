from sqlalchemy.orm import Session
import models
from datetime import date, timedelta
import math

POINTS_PER_COMPLETION = 10
POINTS_PER_STREAK_DAY = 5

def update_user_xp(db: Session, user_id: int, points: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.points += points
        # Simple leveling logic: level = floor(sqrt(points / 100)) + 1
        new_level = math.floor(math.sqrt(user.points / 100)) + 1
        if new_level > user.level:
            user.level = new_level
        db.commit()
        db.refresh(user)
    return user

def check_and_award_badges(db: Session, user_id: int):
    # Fetch all badges from the system
    all_badges = db.query(models.Badge).all()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return []
    
    # Get already earned badges
    earned_badge_ids = {ub.badge_id for ub in user.badges}
    
    newly_earned = []
    
    # Calculate current stats for badge checking
    habits = db.query(models.Habit).filter(models.Habit.user_id == user_id, models.Habit.is_archived == False).all()
    total_habits = len(habits)
    
    # MAX Streak across all habits
    max_streak = 0
    today = date.today()
    
    for habit in habits:
        # Simple streak calculation: count consecutive days with completions
        completion_dates = sorted([c.date for c in habit.completions], reverse=True)
        streak = 0
        if completion_dates:
            check_date = today
            # If not completed today, check yesterday
            if completion_dates[0] != check_date:
                check_date = check_date - timedelta(days=1)
            
            for d in completion_dates:
                if d == check_date:
                    streak += 1
                    check_date = check_date - timedelta(days=1)
                elif d < check_date:
                    break
        max_streak = max(max_streak, streak)

    # Level
    current_level = user.level

    for badge in all_badges:
        if badge.id in earned_badge_ids:
            continue
        
        criteria = badge.criteria
        is_eligible = False
        
        if not criteria:
            continue # Manual or no criteria
            
        # Check streak criteria
        if "streak" in criteria:
            if max_streak >= criteria["streak"]:
                is_eligible = True
                
        # Check habits count criteria
        if "habits" in criteria:
            if total_habits >= criteria["habits"]:
                is_eligible = True

        # Check level criteria
        if "level" in criteria:
            if current_level >= criteria["level"]:
                is_eligible = True

        if is_eligible:
            user_badge = models.UserBadge(user_id=user_id, badge_id=badge.id)
            db.add(user_badge)
            newly_earned.append(badge)
            
    if newly_earned:
        db.commit()
        
    return newly_earned
