# dev libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
# voice libraries 
from TTS.api import TTS
import torch 

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


class Text(BaseModel):
    text: str
@app.post("/clone-voice")
async def process(text: Text):
    print("the text is: ", text.text)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    # Init TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
    # Text to speech to a file
    tts.tts_to_file(text=text.text, speaker_wav="voice-test/test.wav", language="en", file_path= "output.wav")
    # voice = . # code to clone the voice
    return FileResponse("./output.wav", media_type="audio/mpeg", filename="output.wav")

