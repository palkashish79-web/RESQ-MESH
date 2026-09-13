from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="RESQ-MESH AI Intelligence Engine")

class PromptRequest(BaseModel):
    prompt: str = ""

@app.get("/")
def health():
    return {"status": "AI Engine Active", "model": "RESQ-Mesh Routing LLM v1"}

@app.post("/predict-risk")
def predict_risk(data: dict):
    return {
        "risk_level": "High",
        "recommended_action": "Evacuate south corridor",
        "mesh_relay_status": "Operational"
    }

@app.post("/assistant")
def chat(req: PromptRequest):
    return {
        "reply": f"AI Guidance: Route 4A is clear. Move to Sector 2 shelter. Signal: {req.prompt}"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
