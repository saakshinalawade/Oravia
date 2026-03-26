from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class User(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

class Project(BaseModel):
    id: str
    name: str
    user_id: str
    video_url: Optional[str] = None
    status: str = "draft"
    created_at: datetime
    updated_at: datetime

class DubbingRequest(BaseModel):
    project_id: str
    source_language: str
    target_language: str
    voice_id: str
    script: Optional[str] = None

class TTSRequest(BaseModel):
    text: str
    voice_id: str
    language: str
    speed: float = 1.0

class STTRequest(BaseModel):
    audio_url: str
    language: str

class ProcessingResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    job_id: Optional[str] = None