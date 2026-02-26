import requests
from config import MEETUP_API_KEY, MEETUP_GROUP_NAME

MEETUP_API_URL = "https://api.meetup.com/gql"

def get_meetup_events() -> list[dict]:
    """Fetches upcoming events from Meetup Pro GraphQL API."""
    query = """
    query {
      groupByUrlname(urlname: "%s") {
        upcomingEvents(input: {first: 20}) {
          edges {
            node {
              id title dateTime endTime
              venue { name address city }
              description
              eventUrl
            }
          }
        }
      }
    }
    """ % MEETUP_GROUP_NAME
    
    headers = {"Authorization": f"Bearer {MEETUP_API_KEY}", "Content-Type": "application/json"}
    res = requests.post(MEETUP_API_URL, json={"query": query}, headers=headers)
    res.raise_for_status()
    
    edges = res.json()["data"]["groupByUrlname"]["upcomingEvents"]["edges"]
    events = []
    for edge in edges:
        n = edge["node"]
        events.append({
            "meetup_id":   n["id"],
            "title":       n["title"],
            "date":        n["dateTime"][:10],
            "time":        n["dateTime"][11:16],
            "location":    n.get("venue", {}).get("name", ""),
            "description": n.get("description", ""),
            "url":         n.get("eventUrl", ""),
        })
    return events
