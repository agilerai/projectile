from celery import Celery
from dotenv import load_dotenv
import os
import time
from supabase import create_client

load_dotenv()


UPSTASH_REDIS_PASSWORD=os.getenv('UPSTASH_REDIS_PASSWORD')
UPSTASH_REDIS_HOST=os.getenv('UPSTASH_REDIS_HOST')
UPSTASH_REDIS_PORT=os.getenv('UPSTASH_REDIS_PORT')

connection_link=f"rediss://:{UPSTASH_REDIS_PASSWORD}@{UPSTASH_REDIS_HOST}:{UPSTASH_REDIS_PORT}?ssl_cert_reqs=required"

app = Celery('main', broker=connection_link, backend=connection_link)


supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_KEY')
)

@app.task
def process_recording(path: str):
    print(f"Processing recording {path}")
    time.sleep(10)  # Blocking sleep
    print(f"Recording {path} processed")
    return 10

# run with: celery -A main worker --loglevel=info --pool=solo