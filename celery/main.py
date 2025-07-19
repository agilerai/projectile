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
    print(f"Processing recording for org {org_id}, path: {path}")
    
    try:
        # Download the file from supabase with retry logic
        bucket = "meetings"
        print(f"Downloading from bucket '{bucket}' with path '{path}'")
        
        # Use signed URL download method (more reliable for large files)
        file_bytes = None
        
        try:
            print("Getting signed URL for download...")
            signed_url_response = supabase.storage.from_(bucket).create_signed_url(path, 3600)  # 1 hour expiry
            
            if not signed_url_response.get('signedURL'):
                raise Exception("Could not get signed URL from Supabase")
            
            signed_url = signed_url_response['signedURL']
            print(f"Got signed URL, starting download...")
            
            # Use requests with streaming (more reliable than httpx for large files)
            session = requests.Session()
            # Configure session for better reliability
            adapter = requests.adapters.HTTPAdapter(
                max_retries=requests.packages.urllib3.util.retry.Retry(
                    total=3,
                    backoff_factor=1,
                    status_forcelist=[500, 502, 503, 504]
                )
            )
            session.mount('https://', adapter)
            session.mount('http://', adapter)
            
            with session.get(signed_url, stream=True, timeout=300) as r:
                r.raise_for_status()
                file_content = bytearray()
                downloaded = 0
                print("Downloading file in chunks...")
                
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk:
                        file_content.extend(chunk)
                        downloaded += len(chunk)
                        # Log progress every MB
                        if downloaded % (1024 * 1024) == 0:
                            print(f"Downloaded {downloaded // (1024 * 1024)} MB...")
                
                file_bytes = io.BytesIO(bytes(file_content))
                print(f"Download successful! Total size: {len(file_content)} bytes ({len(file_content) // (1024 * 1024)} MB)")
        
        except Exception as e:
            print(f"Signed URL download failed: {str(e)}")
            print("Falling back to direct Supabase download...")
            
            # Fallback to direct download
            try:
                response = supabase.storage.from_(bucket).download(path)
                file_bytes = io.BytesIO(response)
                print(f"Direct download successful, size: {len(response)} bytes")
            except Exception as direct_error:
                raise Exception(f"Both download methods failed. Signed URL error: {str(e)}, Direct error: {str(direct_error)}")
        
        if file_bytes is None:
            raise Exception("Failed to download file - no data received")
        
        # Upload file to Google Gemini endpoint
        print("Uploading file to Gemini...")
        file = gemini_client.files.upload(file=file_bytes, config={
            "mime_type": "video/mp4"
        })
        print(f"Uploaded to Gemini, file ID: {file.name}")
        
        # Wait for file to be processed and become ACTIVE
        print("Waiting for file to be processed...")
        import time
        max_wait_time = 300  # 5 minutes max wait
        start_time = time.time()
        
        while True:
            file_info = gemini_client.files.get(name=file.name)
            print(f"File state: {file_info.state}")
            
            if file_info.state == "ACTIVE":
                print("File is ready for processing!")
                break
            elif file_info.state == "FAILED":
                raise Exception(f"File processing failed: {file_info}")
            elif time.time() - start_time > max_wait_time:
                raise Exception(f"File processing timeout after {max_wait_time} seconds")
            else:
                print("File still processing, waiting 10 seconds...")
                time.sleep(10)
        
        # Generate content with Gemini
        print("Generating tickets with Gemini...")
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[file, "Create a list of jira tickets from the recording. "],
            config={
                "response_schema": list[Ticket]
            }
        )
        print(response.text)
        tickets = response.parsed
        print(tickets)
        
        issue_type_id = 10000
        for i, ticket in enumerate(tickets):
            print(f"Creating ticket {i+1}: {ticket.title}")
            # Make web request to juncture server createTicket endpoint
            ticket_response = requests.post(f"{JUNCTURE_SERVER_URL}/api/backend/create-ticket", json={
                "title": ticket.title,
                "description": ticket.description,
                "issue_type_id": issue_type_id,
                "external_id": org_id
            }, headers={
                "Authorization": f"Bearer {os.getenv('JUNCTURE_SECRET_KEY')}"
            })
            
            if ticket_response.status_code == 200:
                print(f"Successfully created ticket: {ticket.title}")
            else:
                print(f"Failed to create ticket: {ticket.title}, status: {ticket_response.status_code}")

        # Clean up the uploaded file from Gemini
        try:
            print(f"Cleaning up Gemini file: {file.name}")
            gemini_client.files.delete(file.name)
            print("File cleanup successful")
        except Exception as cleanup_error:
            print(f"Warning: Failed to cleanup Gemini file: {cleanup_error}")

        print(f"Recording {path} processed successfully")
        return {
            "success": True,
            "tickets_created": len(tickets),
            "org_id": org_id,
            "path": path
        }
        
    except Exception as e:
        # Try to clean up the file even if processing failed
        try:
            if 'file' in locals() and file:
                print(f"Cleaning up Gemini file after error: {file.name}")
                gemini_client.files.delete(file.name)
        except:
            pass  # Ignore cleanup errors when already handling an error
            
        print(f"Error processing recording {path}: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        raise

# run with: celery -A main worker --loglevel=info --pool=solo