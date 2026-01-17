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
        await manager.broadcast("Um usuario entrou na sala.")
        while True:
            message = await websocket.receive_text()
            await manager.broadcast(message)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("Um usuario saiu da sala.")
