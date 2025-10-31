from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os, json, re
from dotenv import load_dotenv
from google import genai  # correct import

from database import SessionLocal, engine
from models import Base, Blog
from schemas import BlogCreate, BlogResponse

# Load env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing in .env file!")

client = genai.Client(api_key=API_KEY)  # create client for Gemini Developer API

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Blog API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Root endpoint
@app.get("/")
def root():
    return {"message": "AI Blog Backend is running!"}

# --- Get top popular languages from Gemini ---
@app.get("/languages")
async def get_languages():
    try:
        prompt = """
List the 20 most popular and widely spoken languages in the world.
Return only the language names in a clean JSON array format like:
["English", "Spanish", "Chinese", ...]
"""
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        raw_text = getattr(response, "text", "[]")

        # Try to extract JSON safely from Gemini output
        try:
            clean_text = re.search(r"\[.*\]", raw_text, re.DOTALL)
            languages = json.loads(clean_text.group()) if clean_text else []
        except Exception:
            languages = ["English", "Spanish", "Chinese", "Hindi", "Arabic"]

        return {"languages": languages}

    except Exception as e:
        print("Error fetching languages:", e)
        return {
            "languages": ["English", "Spanish", "Chinese", "Hindi", "Arabic"]
        }

# Pydantic model for prompt
class Prompt(BaseModel):
    prompt: str
    language: str = "English"  # ✅ Default to English if not provided

# --- Generate AI blog endpoint with structured formatting ---
@app.post("/generate")
async def generate_blog(prompt: Prompt):
    try:
        # ✅ Added language-aware structured prompt
        structured_prompt = f"""
Write a detailed, well-structured blog about: "{prompt.prompt}".
The blog must be entirely written in {prompt.language} language — even if the topic is in another language.
Make it sound natural and native for {prompt.language} readers.

Formatting rules:
- Use headings (H1, H2, H3) for main sections
- Numbered lists for main categories
- Bullet points for sub-items
- Short, clear paragraphs
- Markdown formatting
Keep it professional, readable, and SEO-friendly.
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=structured_prompt
        )

        generated_text = getattr(response, "text", None) or "No content generated."
        print("Gemini response:", response)

        return {"content": generated_text}

    except Exception as e:
        print("Error generating blog:", e)
        return {"error": str(e)}

# --- Create blog ---
@app.post("/blogs", response_model=BlogResponse)
def create_blog(blog: BlogCreate, db: Session = Depends(get_db)):
    db_blog = Blog(title=blog.title, content=blog.content, tags=blog.tags)
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

# --- Get all blogs ---
@app.get("/blogs", response_model=list[BlogResponse])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).all()

# --- Get blog by ID ---
@app.get("/blogs/{blog_id}", response_model=BlogResponse)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog:
        return blog
    return {"error": "Blog not found"}
