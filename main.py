from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, StreamingResponse
from sqlmodel import SQLModel, Field, Session, create_engine, select
from pydantic import BaseModel
from typing import List
import csv
from io import StringIO
from sqlalchemy.orm import sessionmaker

app = FastAPI()

DATABASE_URL = "sqlite:///game_data.db"  # Make db path more visible
engine = create_engine(DATABASE_URL, echo=False) # Usually don't want echo in production

# Dependency for database sessions
def get_session():
    with Session(engine) as session:
        yield session

# SQLModel definition for the GameResult table
class GameResult(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    device_id: str = Field(index=True) # Add index for faster queries
    level: int
    score: int

# Initialize the database if it doesn't exist (run once)
SQLModel.metadata.create_all(engine)  # No need for a separate function

# Pydantic model for request body
class GameResultCreate(BaseModel):
    device_id: str
    level: int
    score: int

# Mount static files for serving frontend
app.mount("/frontend", StaticFiles(directory="frontend"), name="static")

# Serve the main HTML file
@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    with open("frontend/index.html") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

# Route to save game results
@app.post("/save_result", response_model=GameResult) # Return created object
async def save_result(result: GameResultCreate, session: Session = Depends(get_session)):
    db_result = GameResult(**result.dict()) # Create GameResult instance
    session.add(db_result)
    session.commit()
    session.refresh(db_result) # To get the auto-generated ID back
    return db_result

# Route to get all results for a specific device
@app.get("/get_results/{device_id}", response_model=List[GameResult])
async def get_results(device_id: str, session: Session = Depends(get_session)):
    results = session.exec(select(GameResult).where(GameResult.device_id == device_id)).all()
    if not results:
        raise HTTPException(status_code=404, detail="No results found for this device")
    return results

# Route to export results as CSV (Excel-compatible)
@app.get("/export_results/{device_id}")
async def export_results(device_id: str, session: Session = Depends(get_session)):
    results = session.exec(select(GameResult).where(GameResult.device_id == device_id)).all()

    if not results:
        raise HTTPException(status_code=404, detail="No results found for this device")

    # Stream CSV directly for better performance with large datasets
    async def iter_csv():
        yield "Level,Score\n"
        for result in results:
            yield f"{result.level},{result.score}\n"

    response = StreamingResponse(iter_csv(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={device_id}_results.csv"
    return response

# No need for __main__ block with uvicorn execution