from __future__ import annotations

from itertools import count
from typing import Dict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: Dict[WebSocket, str] = {}
        self._counter = count(1)

    async def connect(self, websocket: WebSocket) -> str:
        await websocket.accept()
        identifier = f"user-{next(self._counter)}"
        self.active_connections[websocket] = identifier
        return identifier

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.pop(websocket, None)

    def get_identifier(self, websocket: WebSocket) -> str:
        return self.active_connections.get(websocket, "unknown")

    async def broadcast(self, message: dict, sender_ws: WebSocket) -> None:
        for connection in list(self.active_connections.keys()):
            if connection is sender_ws:
                continue
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)
