from __future__ import annotations

from typing import Set

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.discard(websocket)

    async def broadcast(self, message: str, sender_ws: WebSocket) -> None:
        for connection in list(self.active_connections):
            if connection is sender_ws:
                continue
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)
