import sys


def run_module(name: str):
    if name in ("email_triage", "1"):
        print("\n=== MODULE 1: Daily Email Triage ===")
        from agents.email_triage import run_email_triage

        return run_email_triage()

    if name in ("weekly_planning", "2"):
        print("\n=== MODULE 2: Weekly Planning Document ===")
        from agents.planning_compiler import run_planning_compiler

        return run_planning_compiler()

    if name == "both":
        print("\n=== RUNNING BOTH MODULES ===")
        from agents.email_triage import run_email_triage
        from agents.planning_compiler import run_planning_compiler

        triage = run_email_triage()
        plan = run_planning_compiler(email_triage_result=triage)
        return {"email_triage": triage, "planning": plan}

    print("Usage: python main.py [1 | 2 | email_triage | weekly_planning | both]")
    return None


if __name__ == "__main__":
    module = sys.argv[1] if len(sys.argv) > 1 else "both"
    run_module(module)
