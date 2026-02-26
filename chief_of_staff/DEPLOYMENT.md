# AI Chief of Staff — Deployment Instructions

This system is built to be deployed on Google Cloud Run, triggered by Cloud Scheduler and Pub/Sub. Because it requires Google Workspace admin access and billing setup, Lisa must execute these steps.

## Prerequisite
Ensure you have the Google Cloud CLI installed (`gcloud`), and have run:
```bash
gcloud auth login
gcloud config set project cpl-chief-of-staff
```

## Step 1: Secret Management
Do not hardcode secrets into the repository. Push them to Secret Manager:

```bash
# Push Gmail OAuth Token
gcloud secrets create gmail-token --replication-policy="automatic"
gcloud secrets versions add gmail-token --data-file="token.json"

# Push Meetup Key
gcloud secrets create meetup-api-key --replication-policy="automatic"
echo -n "YOUR_MEETUP_KEY" | gcloud secrets versions add meetup-api-key --data-file=-

# Push Slack Token
gcloud secrets create slack-bot-token --replication-policy="automatic"
echo -n "xoxb-YOUR-TOKEN" | gcloud secrets versions add slack-bot-token --data-file=-
```

## Step 2: Build and Deploy to Cloud Run

```bash
# Build the container image
gcloud builds submit --tag gcr.io/cpl-chief-of-staff/chief-of-staff

# Deploy the container
gcloud run deploy chief-of-staff \
  --image gcr.io/cpl-chief-of-staff/chief-of-staff \
  --region us-central1 \
  --platform managed \
  --no-allow-unauthenticated \
  --memory 1Gi \
  --timeout 300 \
  --set-env-vars GCP_PROJECT=cpl-chief-of-staff,GCP_REGION=us-central1 \
  --set-secrets MEETUP_API_KEY=meetup-api-key:latest,SLACK_BOT_TOKEN=slack-bot-token:latest
```

Wait a moment while it deploys. It will output a URL (e.g., `https://chief-of-staff-12345-uc.a.run.app`).

## Step 3: Trigger Infrastructure

Create a Pub/Sub topic and subscription to push scheduled events to your new Cloud Run service.

```bash
# 1. Create the topic
gcloud pubsub topics create chief-of-staff-triggers

# 2. Create the push subscription (Replace YOUR_URL with the Cloud Run output from Step 2)
# (Also replace YOUR_SERVICE_ACCOUNT with the Cloud Run SA)
gcloud pubsub subscriptions create cos-push-sub \
  --topic=chief-of-staff-triggers \
  --push-endpoint=YOUR_URL/trigger \
  --push-auth-service-account=YOUR_SERVICE_ACCOUNT
```

## Step 4: Setup Cloud Scheduler Jobs

Finally, create the cron jobs to fire messages into the Pub/Sub topic on schedule:

```bash
# Morning Brief (Weekdays at 8:00 AM)
gcloud scheduler jobs create pubsub morning-brief \
  --schedule="0 8 * * 1-5" \
  --topic=chief-of-staff-triggers \
  --message-body='{"trigger":"morning_brief"}' \
  --time-zone="America/New_York"

# Event Check (Every Day at 9:00 AM)
gcloud scheduler jobs create pubsub event-check \
  --schedule="0 9 * * *" \
  --topic=chief-of-staff-triggers \
  --message-body='{"trigger":"event_check"}' \
  --time-zone="America/New_York"

# Weekly Planning (Fridays at 3:00 PM)
gcloud scheduler jobs create pubsub weekly-planning \
  --schedule="0 15 * * 5" \
  --topic=chief-of-staff-triggers \
  --message-body='{"trigger":"weekly_planning"}' \
  --time-zone="America/New_York"
```
