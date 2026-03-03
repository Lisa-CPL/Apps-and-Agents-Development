import schedule
import time

from main import run_module


def job_email():
    run_module("email_triage")


def job_weekly():
    run_module("weekly_planning")


for day in ["monday", "tuesday", "wednesday", "thursday", "friday"]:
    getattr(schedule.every(), day).at("08:00").do(job_email)

schedule.every().friday.at("15:00").do(job_weekly)

print("CPL Chief of Staff scheduler running.")
print("  Module 1 (Email Triage):  weekdays at 08:00")
print("  Module 2 (Weekly Plan):   Fridays  at 15:00")
print("  Press Ctrl+C to stop.")

while True:
    schedule.run_pending()
    time.sleep(60)
