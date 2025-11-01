from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os, json
from dotenv import load_dotenv
import google.generativeai as genai

from database import SessionLocal, engine
from models import Base, Blog
from schemas import BlogCreate, BlogResponse

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing in .env file!")

genai.configure(api_key=API_KEY)

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
        response = genai.chat.completions.create(
            model="gemini-2.0",
            messages=[{"role": "user", "content": prompt_text}]
        )
        text = response.choices[0].message.content
        languages = json.loads(text) if text else []
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
        response = genai.chat.completions.create(
            model="gemini-2.0",
            messages=[{"role": "user", "content": structured_prompt}]
        )
        generated_text = response.choices[0].message.content
        if not generated_text.strip():
            generated_text = "No content generated."
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
