import schedule
import time
from main import trigger

# ─── Daily triggers ───────────────────────────
schedule.every().monday.at("08:00").do(trigger, "morning_brief")
schedule.every().tuesday.at("08:00").do(trigger, "morning_brief")
schedule.every().wednesday.at("08:00").do(trigger, "morning_brief")
schedule.every().thursday.at("08:00").do(trigger, "morning_brief")

# Event integrity check — daily including weekends
schedule.every().day.at("09:00").do(trigger, "event_check")

# Wellness check — weekdays
schedule.every().monday.at("08:05").do(trigger, "wellness_check")
schedule.every().tuesday.at("08:05").do(trigger, "wellness_check")
schedule.every().wednesday.at("08:05").do(trigger, "wellness_check")
schedule.every().thursday.at("08:05").do(trigger, "wellness_check")
schedule.every().friday.at("08:05").do(trigger, "wellness_check")

# ─── Weekly trigger ───────────────────────────
schedule.every().friday.at("15:00").do(trigger, "weekly_planning")

# ─── Transcript check — every 4 hours on weekdays
schedule.every(4).hours.do(trigger, "transcript_new")

print("Chief of Staff scheduler running...")
while True:
    schedule.run_pending()
    time.sleep(60)
