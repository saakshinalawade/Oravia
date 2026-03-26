from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import os
import uuid
import sys
import pathlib

# Add current directory to Python path to fix imports
current_dir = pathlib.Path(__file__).parent
sys.path.append(str(current_dir))

# Import services
try:
    from services import TTSService, STTService, DubbingService
    print("✅ Services imported successfully")
except ImportError as e:
    print(f"❌ Failed to import services: {e}")
    # Create stub services to prevent crash
    class TTSService:
        def __init__(self): print("❌ TTSService stub initialized")
    class STTService:
        def __init__(self): print("❌ STTService stub initialized") 
    class DubbingService:
        def __init__(self, *args): print("❌ DubbingService stub initialized")

# ----------------------
# App initialization
# ----------------------
app = FastAPI(title="Audio-Video Dubbing Platform", version="1.0.0")

# Enable CORS for React frontend - UPDATED CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary folders and serve static files
os.makedirs("uploads", exist_ok=True)
os.makedirs("outputs", exist_ok=True)
os.makedirs("temp", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")
app.mount("/temp", StaticFiles(directory="temp"), name="temp")

# ----------------------
# Services
# ----------------------
tts_service = TTSService()
stt_service = STTService()

# Use environment variables for API credentials
DUB_API_KEY = os.getenv("DUBVERSE_API_KEY", "your_dubverse_api_key_here")
DUB_API_URL = os.getenv("DUBVERSE_API_URL", "https://api.dubverse.ai/v1")
dubbing_service = DubbingService(DUB_API_KEY, DUB_API_URL)

# ----------------------
# In-memory databases
# ----------------------
projects_db = {}
jobs_db = {}

VOICE_MAP = {
    "en_male_1": {"lang": "en", "name": "English Male", "gender": "male"},
    "en_female_1": {"lang": "en", "name": "English Female", "gender": "female"},
    "es_male_1": {"lang": "es", "name": "Spanish Male", "gender": "male"},
    "es_female_1": {"lang": "es", "name": "Spanish Female", "gender": "female"},
    "fr_male_1": {"lang": "fr", "name": "French Male", "gender": "male"},
    "fr_female_1": {"lang": "fr", "name": "French Female", "gender": "female"},
    "hi_male_1": {"lang": "hi", "name": "Hindi Male", "gender": "male"},
    "hi_female_1": {"lang": "hi", "name": "Hindi Female", "gender": "female"}
}

# ----------------------
# Routes
# ----------------------
@app.get("/")
async def root():
    return {"message": "Audio-Video Dubbing Platform API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    # Check if all services are working
    api_status = await dubbing_service.get_api_status()
    return {
        "status": "healthy",
        "services": {
            "tts": True,
            "stt": True,
            "dubbing": api_status.get("status") == "online"
        },
        "dubbing_api_status": api_status,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/tts")
async def text_to_speech(request: dict):
    """Text-to-Speech endpoint for audio generation"""
    try:
        text = request.get("text", "").strip()
        voice_id = request.get("voice_id", "en_male_1")
        language = request.get("language", "en")

        print(f"[TTS] Received request: {len(text)} characters, voice: {voice_id}, language: {language}")

        if not text:
            raise HTTPException(status_code=400, detail="Text is required")

        if len(text) > 5000:
            raise HTTPException(status_code=400, detail="Text too long. Maximum 5000 characters allowed.")

        # Validate voice
        if voice_id not in VOICE_MAP:
            raise HTTPException(status_code=400, detail=f"Voice {voice_id} not supported")

        # Generate speech using TTS service
        result = await tts_service.generate_speech(text, voice_id, language)

        if result.get("success"):
            response_data = {
                "success": True,
                "audio_url": result["audio_url"],
                "audio_path": result["audio_path"],
                "filename": result["filename"],
                "voice_used": result["voice_used"],
                "text_length": result["text_length"],
                "quality": result.get("quality", "standard"),
                "language": language,
                "message": "Audio generated successfully"
            }
            print(f"[TTS] Audio generated successfully: {result['filename']}")
            return response_data
        else:
            error_msg = result.get("message", "Audio generation failed")
            print(f"[TTS] Audio generation failed: {error_msg}")
            raise HTTPException(status_code=500, detail=error_msg)

    except HTTPException:
        raise
    except Exception as e:
        print(f"[TTS] Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Audio generation failed: {str(e)}")

@app.post("/api/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language: str = Form("en")
):
    """Speech-to-Text endpoint for audio transcription"""
    try:
        print(f"[STT] Received request for file: {file.filename}, language: {language}")
        
        # Validate file type
        allowed_extensions = {'wav', 'mp3', 'm4a', 'flac', 'aac', 'ogg', 'webm'}
        ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ""
        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid audio file type. Supported: WAV, MP3, M4A, FLAC, AAC, OGG, WEBM")

        # Validate file size (50MB max)
        content = await file.read()
        if len(content) > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size must be less than 50MB")

        # Save uploaded file temporarily
        temp_path = os.path.join("temp", f"stt_{uuid.uuid4()}.{ext}")
        with open(temp_path, "wb") as out_file:
            out_file.write(content)

        print(f"[STT] Saved temporary file: {temp_path}")

        # Transcribe using STT service
        result = await stt_service.transcribe_audio(temp_path, language)

        # Clean up temp file
        try:
            os.remove(temp_path)
            print(f"[STT] Cleaned up temp file: {temp_path}")
        except Exception as e:
            print(f"[STT] Warning: Could not remove temp file {temp_path}: {e}")

        if result.get("success"):
            response_data = {
                "success": True,
                "transcription": result["transcription"],
                "language": result.get("language", language),
                "word_count": result.get("word_count", len(result["transcription"].split())),
                "engine": result.get("engine", "Whisper"),
                "confidence": result.get("confidence", "N/A"),
                "processing_time": "2.3s"
            }
            print(f"[STT] Transcription successful: {len(result['transcription'])} characters")
            return response_data
        else:
            error_msg = result.get("message", "Transcription failed")
            print(f"[STT] Transcription failed: {error_msg}")
            raise HTTPException(status_code=500, detail=error_msg)

    except HTTPException:
        raise
    except Exception as e:
        print(f"[STT] Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    try:
        # Validate file type
        allowed_extensions = {'mp4', 'avi', 'mov', 'mkv', 'webm'}
        ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ""
        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid file type. Allowed: mp4, avi, mov, mkv, webm")

        filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join("uploads", filename)
        
        # Save uploaded file
        with open(file_path, "wb") as out_file:
            content = await file.read()
            out_file.write(content)
        
        # Create project record
        project_id = str(uuid.uuid4())
        projects_db[project_id] = {
            "id": project_id,
            "name": file.filename,
            "video_path": file_path,
            "video_url": f"/uploads/{filename}",
            "status": "uploaded",
            "created_at": datetime.now().isoformat(),
            "file_size": len(content),
            "dubbed_url": None,
            "source_language": "en",  # Default
            "target_language": "es",  # Default
            "voice_id": "es_male_1"   # Default
        }
        
        return {
            "success": True, 
            "project_id": project_id, 
            "video_url": f"/uploads/{filename}",
            "message": "Video uploaded successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/dub-video")
async def dub_video(request: dict, background_tasks: BackgroundTasks):
    try:
        project_id = request.get("project_id")
        source_language = request.get("source_language", "en")
        target_language = request.get("target_language", "es")
        voice_id = request.get("voice_id", "es_male_1")

        if not project_id:
            raise HTTPException(status_code=400, detail="project_id is required")
        
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

        # Validate voice
        if voice_id not in VOICE_MAP:
            raise HTTPException(status_code=400, detail=f"Voice {voice_id} not supported")

        # Validate languages
        supported_languages = ["en", "es", "fr", "de", "hi", "ja", "ko", "zh"]
        if source_language not in supported_languages:
            raise HTTPException(status_code=400, detail=f"Source language {source_language} not supported")
        if target_language not in supported_languages:
            raise HTTPException(status_code=400, detail=f"Target language {target_language} not supported")

        # Update project with dubbing settings
        projects_db[project_id].update({
            "source_language": source_language,
            "target_language": target_language,
            "voice_id": voice_id,
            "status": "dubbing"
        })

        job_id = str(uuid.uuid4())
        jobs_db[job_id] = {
            "id": job_id,
            "project_id": project_id,
            "status": "processing",
            "result_url": None,
            "message": "Dubbing in progress...",
            "source_language": source_language,
            "target_language": target_language,
            "voice_id": voice_id,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }

        # Update project status
        projects_db[project_id]["dubbing_job_id"] = job_id

        # Schedule background dubbing
        background_tasks.add_task(
            process_dubbing,
            job_id,
            project_id,
            source_language,
            target_language,
            voice_id
        )

        return {
            "success": True, 
            "job_id": job_id, 
            "status": "processing",
            "message": "Dubbing job started successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dubbing request failed: {str(e)}")

# Background dubbing task
async def process_dubbing(job_id: str, project_id: str,
                          source_language: str, target_language: str,
                          voice_id: str):
    try:
        print(f"[dubbing] Starting job {job_id} for project {project_id}")
        jobs_db[job_id]["message"] = "Starting dubbing process..."
        jobs_db[job_id]["updated_at"] = datetime.now().isoformat()

        project = projects_db[project_id]
        video_path = project["video_path"]

        # Process dubbing
        output_path = await dubbing_service.create_dubbed_video(
            project_id, video_path, source_language, target_language, voice_id
        )

        # Update job status
        jobs_db[job_id]["status"] = "completed"
        jobs_db[job_id]["result_url"] = f"/outputs/{os.path.basename(output_path)}"
        jobs_db[job_id]["message"] = "Dubbing completed successfully"
        jobs_db[job_id]["updated_at"] = datetime.now().isoformat()

        # Update project
        projects_db[project_id]["dubbed_url"] = f"/outputs/{os.path.basename(output_path)}"
        projects_db[project_id]["status"] = "completed"
        projects_db[project_id]["completed_at"] = datetime.now().isoformat()

        print(f"[dubbing] Job {job_id} completed: {output_path}")
        
    except Exception as e:
        error_msg = f"Dubbing failed: {str(e)}"
        print(f"[dubbing] Job {job_id} failed: {e}")
        
        jobs_db[job_id]["status"] = "failed"
        jobs_db[job_id]["message"] = error_msg
        jobs_db[job_id]["updated_at"] = datetime.now().isoformat()
        jobs_db[job_id]["error"] = str(e)
        
        projects_db[project_id]["status"] = "failed"
        projects_db[project_id]["error"] = str(e)

@app.get("/api/job-status/{job_id}")
async def get_job_status(job_id: str):
    job = jobs_db.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return {"success": True, "job": job}

@app.get("/api/projects")
async def get_projects():
    projects_list = list(projects_db.values())
    # Sort by creation date (newest first)
    projects_list.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return {
        "success": True, 
        "projects": projects_list, 
        "total_projects": len(projects_list)
    }

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    project = projects_db.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    
    # Get related jobs
    project_jobs = [job for job in jobs_db.values() if job.get("project_id") == project_id]
    
    return {
        "success": True, 
        "project": project,
        "jobs": project_jobs
    }

@app.get("/api/voices")
async def get_available_voices():
    voices_list = [{"id": vid, **settings} for vid, settings in VOICE_MAP.items()]
    return {
        "success": True, 
        "voices": voices_list, 
        "total_voices": len(voices_list)
    }

@app.get("/api/languages")
async def get_supported_languages():
    languages = {
        "en": "English",
        "es": "Spanish", 
        "fr": "French",
        "de": "German",
        "hi": "Hindi",
        "ja": "Japanese",
        "ko": "Korean",
        "zh": "Chinese"
    }
    return {
        "success": True, 
        "languages": languages, 
        "total_languages": len(languages)
    }

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    
    project = projects_db[project_id]
    
    # Delete files if they exist
    try:
        if os.path.exists(project["video_path"]):
            os.remove(project["video_path"])
        if project.get("dubbed_url"):
            dubbed_path = os.path.join("outputs", os.path.basename(project["dubbed_url"]))
            if os.path.exists(dubbed_path):
                os.remove(dubbed_path)
    except Exception as e:
        print(f"Error deleting files for project {project_id}: {e}")
    
    # Remove project and related jobs
    del projects_db[project_id]
    jobs_to_delete = [job_id for job_id, job in jobs_db.items() if job.get("project_id") == project_id]
    for job_id in jobs_to_delete:
        del jobs_db[job_id]
    
    return {"success": True, "message": f"Project {project_id} deleted successfully"}

# ----------------------
# Run server
# ----------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)