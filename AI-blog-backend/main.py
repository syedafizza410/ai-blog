from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os, json
from dotenv import load_dotenv

from database import SessionLocal, engine
from models import Base, Blog
from schemas import BlogCreate, BlogResponse

# --- Import old-style client ---
from google.ai import generativelanguage as gl
from google.ai.generativelanguage.types import TextPrompt, GenerateTextRequest

load_dotenv()

# Database setup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Blog API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Old-style client ---
client = gl.TextServiceClient()
model_name = "models/text-bison-001"  # Use Gemini text model

@app.get("/")
def root():
    return {"message": "AI Blog Backend is running!"}

@app.get("/languages")
async def get_languages():
    try:
        prompt_text = """
List 50 widely spoken languages in the world, including all scripts (Latin, Cyrillic, Arabic, Devanagari, etc.).
Return only the language names in a JSON array like:
["English", "Spanish", "Chinese", "Hindi", "Urdu", "Arabic", ...]
Do not add explanations, just the array.
"""
        request = GenerateTextRequest(
            model=model_name,
            prompt=TextPrompt(text=prompt_text)
        )
        response = client.generate_text(request=request)
        languages_raw = response.output[0].content if response.output else ""
        languages = json.loads(languages_raw) if languages_raw else []
        return {"languages": languages}
    except Exception as e:
        print("Error fetching languages:", e)
        return {"languages": []}

class Prompt(BaseModel):
    prompt: str
    language: str = "English"

@app.post("/generate")
async def generate_blog(prompt: Prompt):
    try:
        structured_prompt = f"""
Write a detailed, well-structured blog about: "{prompt.prompt}".
The blog must be entirely written in {prompt.language}.
Make it sound natural and native for {prompt.language} readers.

Formatting rules:
- Headings (H1, H2, H3)
- Numbered lists for main categories
- Bullet points for sub-items
- Short, clear paragraphs
- Markdown formatting
"""
        request = GenerateTextRequest(
            model=model_name,
            prompt=TextPrompt(text=structured_prompt)
        )
        response = client.generate_text(request=request)
        generated_text = response.output[0].content if response.output else "No content generated."

        return {"content": generated_text}

    except Exception as e:
        print("Error generating blog:", e)
        return {"error": str(e)}

@app.post("/blogs", response_model=BlogResponse)
def create_blog(blog: BlogCreate, db: Session = Depends(get_db)):
    db_blog = Blog(title=blog.title, content=blog.content, tags=blog.tags)
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

@app.get("/blogs", response_model=list[BlogResponse])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).all()

@app.get("/blogs/{blog_id}", response_model=BlogResponse)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog:
        return blog
    return {"error": "Blog not found"}