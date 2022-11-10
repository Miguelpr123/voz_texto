let rec;

if(!("webkitSpeechRecognition" in window) ){
    alert('sin reconocimiento de voz');
}else{
    rec = new webkitSpeechRecognition();
    rec.lang = "es-AR";
    rec.continuous = true;
    rec.interim = true;
    rec.addEventListener('result' , iniciar );

}

function iniciar(event) {
    for (let i = event.resultIndex ; i < event.results.length; i++) {
        document.getElementById('texto').innerHTML = event.results[i][0].transcript;
    }
}


rec.start();

