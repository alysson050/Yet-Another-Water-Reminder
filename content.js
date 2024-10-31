// Ouve a mensagem enviada pelo background.js
document.addEventListener("DOMContentLoaded", function () {
    chrome.runtime.sendMessage('update-dom', (response) => {
        if (message.action === 'update-dom') {
            const recommended = document.querySelector('.squareNum');
            const mlTomados = document.querySelector('.tomou');
            const mlFaltam = document.querySelector('.falta');
            if (recommended) {
                recommended.innerHTML = response.coposAtualizados;
            }
            if (mlTomados){
                mlTomados.innerHTML = response.mlTomadosUpd;
            }
           if (mlFaltam){
            
                mlFaltam.innerHTML = response.mlFaltamUpd;
           }
        };
    }
)});
