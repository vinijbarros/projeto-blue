# Desafio: Comunicacao com WebSockets

Implementacao simples de chat em tempo real usando FastAPI no backend e HTML/CSS/JS puro no frontend.

## Como instalar

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Como rodar

```bash
cd backend
uvicorn main:app --reload
```

Depois, abra o arquivo `frontend/index.html` no navegador.

## Como testar

1. Abra `frontend/index.html` em duas abas.
2. Digite uma mensagem em uma aba e confira o recebimento na outra.

## Checklist de requisitos

- [x] Backend com FastAPI + Uvicorn
- [x] Endpoint HTTP (`GET /health`)
- [x] WebSocket funcionando em tempo real
- [x] Frontend com HTML + CSS + JavaScript puro
- [x] Estrutura de pastas solicitada
- [x] README com instalar, rodar e testar
