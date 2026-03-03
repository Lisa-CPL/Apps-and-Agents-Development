# CPL Chief of Staff System

AI Chief of Staff automation built with Google ADK patterns, Vertex AI (Gemini), Google Workspace APIs, and Firestore.

## What This System Does

- Module 1 (`email_triage`):
  - Reads unread Gmail + unreplied inbox threads
  - Classifies messages with Gemini (`gemini-2.0-flash`)
  - Creates draft replies for high-priority items
  - Stores review payloads in Firestore (`pending_approvals`)

- Module 2 (`weekly_planning`):
  - Reads past/upcoming calendar events
  - Pulls open Firestore action items
  - Synthesizes a weekly planning brief with Gemini
  - Creates a formatted Google Doc and optionally emails a notification

- Scheduler:
  - Weekdays 08:00: Module 1
  - Fridays 15:00: Module 2

## Project Structure

```text
cpl-chief-of-staff/
├── agents/
│   ├── email_triage.py
│   └── planning_compiler.py
├── tools/
│   ├── gmail_tools.py
│   ├── calendar_tools.py
│   └── gdocs_tools.py
├── storage/
│   └── firestore_client.py
├── runners/
│   └── scheduler.py
├── config.py
├── main.py
├── generate_token.py
├── .env
├── .gitignore
└── requirements.txt
```

## Prerequisites

- Windows 11
- Python 3.11+
- Google Cloud CLI (`gcloud`)
- Node.js LTS
- A Google Cloud project with billing enabled
- Enabled APIs:
  - `gmail.googleapis.com`
  - `calendar-json.googleapis.com`
  - `drive.googleapis.com`
  - `docs.googleapis.com`
  - `aiplatform.googleapis.com`
  - `firestore.googleapis.com`
  - `secretmanager.googleapis.com`

## 1) Environment Setup

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

If `requirements.txt` is outdated for your environment, install missing packages from the build guide and re-freeze.

## 2) Google Cloud Auth

Login and set application default credentials:

```powershell
gcloud auth login
gcloud config set project cpl-chief-of-staff-system
gcloud auth application-default login
```

## 3) OAuth Credentials for Gmail/Calendar/Docs/Drive

1. In GCP Console, create OAuth client credentials (Desktop App).
2. Save downloaded JSON as `credentials.json` in the project root.
3. Generate token:

```powershell
.\.venv\Scripts\python.exe generate_token.py
```

This creates `token.json` in the project root.

## 4) Firestore

Create Firestore database (one-time):

```powershell
gcloud firestore databases create --region=us-central1
```

## 5) Configuration

Update `.env`:

```env
GCP_PROJECT=cpl-chief-of-staff-system
GCP_REGION=us-central1
NOTIFICATION_EMAIL=you@example.com
PENDING_APPROVAL_DOC=
PLANNING_DOC_FOLDER=
```

Notes:
- `NOTIFICATION_EMAIL` receives weekly plan notifications.
- `PENDING_APPROVAL_DOC` and `PLANNING_DOC_FOLDER` are included for workflow extension.

## Run the System

Activate venv first:

```powershell
.\.venv\Scripts\activate
```

Run Module 1 only:

```powershell
python main.py 1
```

Run Module 2 only:

```powershell
python main.py 2
```

Run both modules sequentially:

```powershell
python main.py both
```

Run scheduler (long-running):

```powershell
python runners/scheduler.py
```

## Data Written by the System

Firestore collections:
- `pending_approvals` (triage outputs + draft metadata)
- `agent_runs` (execution logs)
- `action_items` (open tasks used by planning compiler)

Google Workspace artifacts:
- Gmail drafts for suggested replies
- Weekly planning Google Docs

## Troubleshooting

- `python`/imports fail:
  - Ensure venv is active: `.\.venv\Scripts\activate`
  - Reinstall deps: `pip install -r requirements.txt`

- OAuth refresh/auth errors (`RefreshError`):
  - Delete `token.json`
  - Re-run: `python generate_token.py`

- Vertex AI `403`:
  - Run: `gcloud auth application-default login`
  - Verify project/region in `.env`
  - Confirm `aiplatform.googleapis.com` is enabled

- Gmail/Calendar/Docs access issues:
  - Confirm OAuth consent and scopes
  - Re-generate `token.json`

- Firestore write errors:
  - Confirm ADC login and correct `GCP_PROJECT`
  - Ensure Firestore DB exists in `us-central1`

## Security

Never commit secrets. This repo already ignores:
- `.env`
- `credentials.json`
- `token.json`
- `.venv/`

## Quick Daily Commands

```powershell
.\.venv\Scripts\activate
python main.py 1
python main.py 2
python main.py both
python runners/scheduler.py
```
