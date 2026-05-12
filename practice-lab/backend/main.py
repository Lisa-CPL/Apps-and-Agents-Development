from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import health, mini_apps, scenarios, responses

app = FastAPI(title="Practice Lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(mini_apps.router, prefix="/api")
app.include_router(scenarios.router, prefix="/api")
app.include_router(responses.router, prefix="/api")
