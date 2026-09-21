from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from src.rag import RAGPipeline
import os

app = FastAPI()

rag = None


@app.get("/health")
def health_check():
    return {"status": "ok"}

class QuestionRequest(BaseModel):
    question: str

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global rag

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    rag = RAGPipeline(pdf_path=file_path)

    return {
        "message": "Upload vaf build index thành công",
        "filename": file.filename
    }


@app.post("/ask")
def ask_question(request: QuestionRequest):
    if rag is None:
        return{
            "error": "Chưa có tài liệu. Hãy upload PDF trước."
        }
    result = rag.ask(request.question)

    return result
    