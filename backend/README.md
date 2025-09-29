Crop-Wise Backend

This folder contains a FastAPI backend that exposes a lightweight crop recommendation endpoint. It trains a simple model at startup using the CSV present in the backend root.

How to run (Windows PowerShell):

1. Create and activate a Python virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Run the server

```powershell
uvicorn app.main:app --reload --port 8000
```

The endpoint will be available at http://localhost:8000/api/recommend
