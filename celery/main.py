from celery import Celery
from dotenv import load_dotenv
import os

load_dotenv()


UPSTASH_REDIS_PASSWORD=os.getenv('UPSTASH_REDIS_PASSWORD')
UPSTASH_REDIS_HOST=os.getenv('UPSTASH_REDIS_HOST')
UPSTASH_REDIS_PORT=os.getenv('UPSTASH_REDIS_PORT')

connection_link=f"rediss://:{UPSTASH_REDIS_PASSWORD}@{UPSTASH_REDIS_HOST}:{UPSTASH_REDIS_PORT}?ssl_cert_reqs=required"

app = Celery('main', broker=connection_link, backend=connection_link)


@app.task
def process_recording():
    return 