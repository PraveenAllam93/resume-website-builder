from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/status")
async def read_status():
    return {"status": "Backend API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

