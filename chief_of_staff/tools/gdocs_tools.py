from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from config import PLANNING_DOC_FOLDER, PENDING_APPROVAL_DOC_ID

def _get_service():
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token: creds.refresh(Request())
    return build("docs", "v1", credentials=creds)

def _get_drive_service():
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token: creds.refresh(Request())
    return build("drive", "v3", credentials=creds)

def create_planning_doc(title: str, content: str) -> dict:
    """Creates a new Google Doc for the weekly plan and inserts content."""
    docs_svc = _get_service()
    drive_svc = _get_drive_service()
    
    # Create the blank document
    doc = docs_svc.documents().create(body={"title": title}).execute()
    doc_id = doc.get("documentId")
    
    # If a folder is specified, move the document there
    if PLANNING_DOC_FOLDER:
        # Retrieve the existing parents to remove
        file = drive_svc.files().get(fileId=doc_id, fields='parents').execute()
        previous_parents = ",".join(file.get('parents'))
        # Move the file to the new folder
        file = drive_svc.files().update(
            fileId=doc_id,
            addParents=PLANNING_DOC_FOLDER,
            removeParents=previous_parents,
            fields='id, parents'
        ).execute()

    # Insert the content into the document
    requests = [
        {
            "insertText": {
                "location": {
                    "index": 1
                },
                "text": content
            }
        }
    ]
    docs_svc.documents().batchUpdate(documentId=doc_id, body={"requests": requests}).execute()
    
    return {
        "doc_id": doc_id,
        "doc_url": f"https://docs.google.com/document/d/{doc_id}/edit",
        "status": "created"
    }

def append_to_approval_doc(doc_id: str, content: str) -> dict:
    """Appends content to the Pending Approval Google Doc."""
    docs_svc = _get_service()
    
    # Get the current document to find the end index
    doc = docs_svc.documents().get(documentId=doc_id).execute()
    content_elements = doc.get('body').get('content')
    
    # Calculate the end index (the index of the last element minus 1 to stay inside the body)
    end_index = content_elements[-1].get('endIndex') - 1
    
    requests = [
        {
            "insertText": {
                "location": {
                    "index": end_index
                },
                "text": f"\n{content}\n"
            }
        }
    ]
    
    docs_svc.documents().batchUpdate(documentId=doc_id, body={"requests": requests}).execute()
    return {"status": "appended"}
