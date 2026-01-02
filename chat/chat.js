document.addEventListener("DOMContentLoaded", () => {
  const chatLog = document.getElementById("chat-log");
  const apiKeyInput = document.getElementById("apiKey");
  const modelSelect = document.getElementById("model");
  const systemInput = document.getElementById("system");
  const messageInput = document.getElementById("texto");
  const sendBtn = document.getElementById("send");
  const clearBtn = document.getElementById("clear");
  const statusEl = document.getElementById("status");

  const history = [];

  const setStatus = (text) => {
    if (statusEl) statusEl.textContent = text || "";
  };

  const appendBubble = (role, text) => {
    const row = document.createElement("div");
    row.className = `message ${role}`;

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = role === "user" ? "Tú" : "Gemini";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    const soundBtn = document.createElement("button");
    soundBtn.className = "sound-btn";
    soundBtn.textContent = "🔊";
    soundBtn.title = "Escuchar";
    soundBtn.addEventListener("click", () => {
      escucharTexto(text);
    });

    row.appendChild(tag);
    row.appendChild(bubble);
    row.appendChild(soundBtn);
    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  const setSending = (sending) => {
    sendBtn.disabled = sending;
    clearBtn.disabled = sending;
    messageInput.disabled = sending;
  };

  sendBtn.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value.trim();
    const prompt = messageInput.value.trim();
    const model = modelSelect.value;
    const systemInstruction = systemInput?.value.trim();

    if (!apiKey) {
      setStatus("Falta API key de Google AI Studio.");
      return;
    }
    if (!prompt) {
      setStatus("Escribe un mensaje.");
      return;
    }

    appendBubble("user", prompt);
    history.push({ role: "user", parts: [{ text: prompt }] });
    messageInput.value = "";

    setSending(true);
    setStatus("Consultando Gemini...");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const payload = { contents: history };

    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
        "Sin respuesta";

      appendBubble("model", text);
      history.push({ role: "model", parts: [{ text }] });
      setStatus("Listo");
    } catch (error) {
      console.error(error);
      appendBubble(
        "model",
        "No pude responder. Revisa la consola e intenta de nuevo."
      );
      setStatus("Error: " + (error?.message || "falló la petición"));
    } finally {
      setSending(false);
    }
  });

  clearBtn.addEventListener("click", () => {
    history.length = 0;
    chatLog.innerHTML = "";
    setStatus("");
    messageInput.value = "";
  });
});
