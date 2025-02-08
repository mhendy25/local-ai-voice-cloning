# dev libraries
from fastapi import  FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
import shutil
# voice libraries 
from TTS.api import TTS
import torch
import pymupdf 
# create the FastAPI app
app = FastAPI()

# set up the cors middleware to allow requests from the frontend
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# API routes

@app.post("/upload-voice")
async def upload_voice(file: UploadFile = File(...)):
    with open("./voices/input.wav", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": "input.wav"}


class Text(BaseModel):
    text: str
@app.post("/clone-voice-from-text")
async def process(text: Text):
    print("the text is: ", text.text)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    # Init TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
    # Text to speech to a file
    tts.tts_to_file(text=text.text, speaker_wav="voices/input.wav", language="en", file_path= "./voices/output.wav")
    # voice = . # code to clone the voice
    return FileResponse("./voices/output.wav", media_type="audio/mpeg", filename="output.wav")

@app.post("/get-sample-voice-from-text")
async def process(text: Text):
    print("the text is: ", text.text)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    # Init TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
    print("the speakers are", tts.speakers)

    # Text to speech to a file
    tts.tts_to_file(text=text.text, speaker = tts.speakers[0], language="en", file_path= "./voices/output.wav")
    # voice = . # code to clone the voice
    return FileResponse("./voices/output.wav", media_type="audio/mpeg", filename="output.wav")

@app.post("/upload-document")
async def upload_voice(file: UploadFile = File(...)):
    with open("./documents/input.pdf", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "file uploaded successfully"} 

@app.post("/get-text-from-document")
async def get_text_from_document():
    doc = pymupdf.open("./documents/input.pdf") 
    text = ""
    for i in range(doc.page_count): 
        text += f"Page {i}: {doc[i].get_text()}" + "\n"
    return {"text": text}