# Frontend
Make your .env file like this:
```
# CLERK
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<from dashboard>
CLERK_SECRET_KEY=<from dashboard>

# JUNCTURE
NEXT_PUBLIC_JUNCTURE_API_URL=<http://localhost:8000>
JUNCTURE_SECRET_KEY=<secret_key>

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=<get from supabase dashboard>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from supabase dashboard>
SUPABASE_SERVICE_KEY=<get from supabase dashboard>

# UPSTASH
UPSTASH_REDIS_HOST=<get url from upstash. do not include hte https://, just start from blank.blank.blank>
UPSTASH_REDIS_PORT=6379
UPSTASH_REDIS_PASSWORD=<api key/token from upstash>
```

# celery
Make your .env file like this:
```
UPSTASH_REDIS_HOST=<get url from upstash. do not include hte https://, just start from blank.blank.blank>
UPSTASH_REDIS_PORT=6379
UPSTASH_REDIS_PASSWORD=<api key/token from upstash>

SUPABASE_URL=
SUPABASE_SERVICE_KEY=
```