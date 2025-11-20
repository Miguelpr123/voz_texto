let rec;

if (!("webkitSpeechRecognition" in window)) {
  alert("sin reconocimiento de voz");
} else {
  rec = new webkitSpeechRecognition();
  rec.lang = "en-US";
  rec.continuous = true;
  rec.interim = true;
  rec.addEventListener("result", iniciar);
}

function iniciar(event) {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    document.getElementById("texto").value +=
      " " + event.results[i][0].transcript;
  }
}

function reset() {
  document.getElementById("texto").value = "";
}

function copiarTexto() {
  const texto = document.getElementById("texto");
  texto.select();
  document.execCommand("copy");
  alert("Texto copiado al portapapeles");
}

function descargarTexto() {
  const texto = document.getElementById("texto").value;
  const blob = new Blob([texto], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transcripcion.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function iniciarReconocimiento() {
  rec.start();
  document.getElementById("recordingIndicator").classList.add("active");
}

function detenerReconocimiento() {
  rec.stop();
  document.getElementById("recordingIndicator").classList.remove("active");
}

function escucharTexto() {
  const texto = document.getElementById("texto").value;
  if (texto.trim() === "") {
    alert("No hay texto para escuchar");
    return;
  }
  speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
}
