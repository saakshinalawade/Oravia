"""Package marker for backend.app

This file ensures the `app` directory is recognized as a Python package so
imports like `app.main` work when running Uvicorn from the `backend` folder.
"""

__all__ = ["main", "services", "models"]
