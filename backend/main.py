from __future__ import annotations

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from connection_manager import ConnectionManager

app = FastAPI(title="WebSocket Chat")
manager = ConnectionManager()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            await manager.broadcast(message, websocket)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        manager.disconnect(websocket)
