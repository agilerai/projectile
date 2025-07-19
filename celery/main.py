from celery import Celery
from dotenv import load_dotenv
import os
from supabase import create_client
import io
from google import genai
from pydantic import BaseModel
import requests

load_dotenv()


UPSTASH_REDIS_PASSWORD=os.getenv('UPSTASH_REDIS_PASSWORD')
UPSTASH_REDIS_HOST=os.getenv('UPSTASH_REDIS_HOST')
UPSTASH_REDIS_PORT=os.getenv('UPSTASH_REDIS_PORT')

JUNCTURE_SERVER_URL=os.getenv('JUNCTURE_SERVER_URL')

connection_link=f"rediss://:{UPSTASH_REDIS_PASSWORD}@{UPSTASH_REDIS_HOST}:{UPSTASH_REDIS_PORT}?ssl_cert_reqs=required"

app = Celery('main', broker=connection_link, backend=connection_link)
gemini_client = genai.Client(api_key=os.getenv('GEMINI_KEY'))


supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_KEY')
)

class Ticket(BaseModel):
    title: str # summary
    description: str
    
    
    
@app.task
def process_recording(org_id: str, path: str):
    print(f"Processing recording {path}")
    
    # download the file from supabase
    bucket = "meetings"
    response = supabase.storage.from_(bucket).download(path)
    file_bytes = io.BytesIO(response)
    
    # upload file to google endpoint
    file = gemini_client.files.upload(file_bytes)
    
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[file, "Create a list of jira tickets from the recording. "],
        config={
            "response_schema": list[Ticket]
        }
    )
    
    tickets = response.parsed
    print(tickets)
    issue_type_id=10000
    for ticket in tickets:
        # make web request to juncture server createTicket endpoint
        requests.post(f"{JUNCTURE_SERVER_URL}/api/backend/create-ticket", json={
            "title": ticket.title,
            "description": ticket.description,
            "issue_type_id": issue_type_id,
            "external_id": org_id
        }, headers={
            "Authorization": f"Bearer {os.getenv('JUNCTURE_SECRET_KEY')}"
        })

    
    print(f"Recording {path} processed")
    return 10

# run with: celery -A main worker --loglevel=info --pool=solo