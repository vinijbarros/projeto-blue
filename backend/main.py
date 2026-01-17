from __future__ import annotations

import logging
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from connection_manager import ConnectionManager

app = FastAPI(title="WebSocket Chat")
manager = ConnectionManager()
logger = logging.getLogger("ws")
logging.basicConfig(level=logging.INFO)


def utc_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    identifier = await manager.connect(websocket)
    logger.info("Conexao aberta: %s", identifier)
    await manager.broadcast(
        {
            "type": "system",
            "event": "user_connected",
            "user": identifier,
            "timestamp": utc_timestamp(),
        },
        websocket,
    )
    try:
        while True:
            message = await websocket.receive_text()
            preview = message[:30]
            logger.info(
                "Mensagem recebida de %s (len=%s, preview=%s)",
                identifier,
                len(message),
                preview,
            )
            payload = {
                "type": "message",
                "id": str(uuid4()),
                "timestamp": utc_timestamp(),
                "message": message,
                "from": identifier,
            }
            await manager.broadcast(payload, websocket)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        await manager.broadcast(
            {
                "type": "system",
                "event": "user_disconnected",
                "user": identifier,
                "timestamp": utc_timestamp(),
            },
            websocket,
        )
        manager.disconnect(websocket)
        logger.info("Conexao encerrada: %s", identifier)
