# Desafio: Comunicacao com WebSockets

## Visao geral
Chat simples em tempo real via WebSockets. O backend recebe mensagens e faz broadcast para os outros clientes conectados. O frontend envia e exibe mensagens no formato JSON.

## Tecnologias
- Python 3.x
- FastAPI + Uvicorn
- HTML, CSS e JavaScript puro

## Como rodar (passo a passo)
```bash
python -m venv .venv
```
```bash
.venv\Scripts\activate
```
```bash
pip install -r backend/requirements.txt
```
```bash
uvicorn backend.main:app --reload --port 8000
```
Depois, abra `frontend/index.html` no navegador.

## Como testar
1. Abra `frontend/index.html` em duas abas.
2. Conecte nas duas abas e envie mensagens para ver o broadcast.

## Checklist de requisitos atendidos
- [x] HTTP endpoint (`GET /health`)
- [x] WebSocket em `/ws`
- [x] Pool de conexoes no `ConnectionManager`
- [x] Broadcast para outros clientes (nao reenvia para o remetente)
- [x] Cliente web com conexao, envio e exibicao de mensagens

## Decisoes tecnicas
O backend usa um pool de conexoes em memoria e identifica cada cliente no momento do connect. Ao receber uma mensagem, monta um payload JSON padrao e envia para todos os outros sockets ativos.

Observacao: mensagens de sistema foram incluidas apenas para demonstrar o ciclo de vida das conexoes WebSocket, sem ampliar o escopo funcional do desafio.

## Possiveis melhorias
- Reconexao automatica no frontend
- Testes automatizados de WebSocket
- Persistencia opcional de historico
