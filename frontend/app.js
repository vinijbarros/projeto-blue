const statusEl = document.getElementById("status");
const statusErrorEl = document.getElementById("statusError");
const systemMessagesEl = document.getElementById("systemMessages");
const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input");
const wsUrlEl = document.getElementById("wsUrl");
const connectBtn = document.getElementById("connectBtn");
const sendBtn = document.getElementById("sendBtn");

let socket = null;

function setStatus(text, state) {
  statusEl.textContent = text;
  statusEl.classList.toggle("status--connected", state === "connected");
  statusEl.classList.toggle("status--error", state === "error");
}

function setError(text) {
  statusErrorEl.textContent = text;
}

function setSendEnabled(enabled) {
  sendBtn.disabled = !enabled;
}

function setConnectLabel(connected) {
  connectBtn.textContent = connected ? "Desconectar" : "Conectar";
}

function scrollMessages(container) {
  container.scrollTop = container.scrollHeight;
}

function addMessageRow({ timestamp, from, message, raw }) {
  const li = document.createElement("li");
  li.className = "message";

  const meta = document.createElement("div");
  meta.className = "message__meta";
  // ASCII separator avoids encoding glitches in some editors.
  meta.textContent = raw ? "mensagem bruta" : `${timestamp} - ${from}`;

  const body = document.createElement("div");
  body.className = "message__body";
  body.textContent = message;

  li.appendChild(meta);
  li.appendChild(body);
  messagesEl.appendChild(li);
  scrollMessages(messagesEl);
}

function eventToText(event) {
  if (event === "user_connected") return "usuario conectado";
  if (event === "user_disconnected") return "usuario desconectado";
  return "evento do sistema";
}

function addSystemMessageRow({ timestamp, user, event }) {
  const li = document.createElement("li");
  li.className = "message message--system";

  const meta = document.createElement("div");
  meta.className = "message__meta";
  meta.textContent = `Sistema - ${timestamp}`;

  const body = document.createElement("div");
  body.className = "message__body";
  body.textContent = `${eventToText(event)} (${user})`;

  li.appendChild(meta);
  li.appendChild(body);
  systemMessagesEl.appendChild(li);
  scrollMessages(systemMessagesEl);
}

function handleIncomingMessage(event) {
  const data = event.data;
  if (typeof data !== "string") {
    addMessageRow({ message: "mensagem bruta", raw: true });
    return;
  }
  try {
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === "object" && parsed.type === "system") {
      addSystemMessageRow({
        timestamp: parsed.timestamp || "-",
        user: parsed.user || "desconhecido",
        event: parsed.event || "evento",
      });
      return;
    }
    addMessageRow({
      timestamp: parsed?.timestamp || "-",
      from: parsed?.from || "desconhecido",
      message: parsed?.message || "",
      raw: false,
    });
  } catch (err) {
    addMessageRow({ message: data, raw: true });
  }
}

function connectSocket() {
  const url = wsUrlEl.value.trim();
  if (!url) {
    setError("Informe uma URL valida.");
    return;
  }
  setError("");
  setStatus("Conectando...", "connecting");
  socket = new WebSocket(url);

  socket.addEventListener("open", () => {
    setStatus("Conectado", "connected");
    setSendEnabled(true);
    setConnectLabel(true);
  });

  socket.addEventListener("message", handleIncomingMessage);

  socket.addEventListener("error", () => {
    setStatus("Erro", "error");
    setError("Falha ao conectar.");
    setSendEnabled(false);
    setConnectLabel(false);
  });

  socket.addEventListener("close", () => {
    if (statusEl.textContent !== "Erro") {
      setStatus("Desconectado", "disconnected");
    }
    setSendEnabled(false);
    setConnectLabel(false);
  });
}

function disconnectSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

connectBtn.addEventListener("click", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    disconnectSocket();
  } else {
    connectSocket();
  }
});

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
