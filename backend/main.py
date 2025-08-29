from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import yt_dlp
import whisper
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Gemini API key not found. Please set it in your .env file.")
genai.configure(api_key=GEMINI_API_KEY)

class VideoRequest(BaseModel):
    video_url: str

app = FastAPI()

@app.post("/api/process-video")
async def process_video(request: VideoRequest):
    video_url = request.video_url
    audio_file = "downloaded_audio.mp3"

    try:
        ydl_opts = { 'format': 'bestaudio/best', 'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192',}], 'outtmpl': audio_file.replace('.mp3', ''), 'quiet': True }
        print("Downloading audio...")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])
        print("Download complete.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading video: {str(e)}")

    try:
        print("Transcribing audio...")
        model = whisper.load_model("base") 
        result = model.transcribe(audio_file)
        transcript = result["text"]
        print("Transcription complete.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during transcription: {str(e)}")
    finally:
        if os.path.exists(audio_file):
            os.remove(audio_file)

    print("Generating content with Gemini...")
    try:
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        
        summary_prompt = f"Summarize the following text into 3-5 key bullet points:\n\n{transcript}"
        summary_response = gemini_model.generate_content(summary_prompt)
        
        quiz_prompt = f"""
        Based on the following transcript, generate a 5-question multiple-choice quiz.
        Provide the output in a valid JSON format.
        The JSON object should have a single key "questions" which is an array.
        Each element in the array should be an object with keys "question", "options" (an array of 4 strings), and "answer" (the correct option string).
        
        Transcript:
        {transcript}
        """
        quiz_response = gemini_model.generate_content(quiz_prompt)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content with Gemini: {str(e)}")

    print("Content generation complete.")
    
    cleaned_quiz_json = quiz_response.text.strip().replace("```json", "").replace("```", "")

    return {
        "summary": summary_response.text,
        "quiz": cleaned_quiz_json
    }