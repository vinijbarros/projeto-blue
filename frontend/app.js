const statusEl = document.getElementById("status");
const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input");

const wsUrl = "ws://localhost:8000/ws";
let socket;

function addMessage(text, type = "message") {
  const li = document.createElement("li");
  li.className = `message message--${type}`;
  li.textContent = text;
  messagesEl.appendChild(li);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setStatus(text, connected) {
  statusEl.textContent = text;
  statusEl.classList.toggle("status--connected", connected);
}

function connect() {
  socket = new WebSocket(wsUrl);

  socket.addEventListener("open", () => {
    setStatus("Conectado", true);
  });

  socket.addEventListener("message", (event) => {
    addMessage(event.data);
  });

  socket.addEventListener("close", () => {
    setStatus("Desconectado", false);
    addMessage("Conexao perdida. Recarregue a pagina para reconectar.", "system");
  });
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = inputEl.value.trim();
  if (!text || !socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }
  socket.send(text);
  inputEl.value = "";
  inputEl.focus();
});

connect();
