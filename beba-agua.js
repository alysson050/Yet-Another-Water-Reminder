const mediaP = document.querySelector('.mediaP');
const recommended = document.querySelector('.squareNum');
const falta = document.querySelector('.falta');
const tomou = document.querySelector('.tomou');
const veraoCopos = document.querySelector('.veraoCopos');
const invernoCopos = document.querySelector('.invernoCopos');

const urlParams = new URLSearchParams(window.location.search);
const media = urlParams.get('media');

const mediaInt = parseInt(media);
let coposRecomendados = Math.ceil(mediaInt / 250);

let mlTomados = 0;
let mlFaltam = media - mlTomados;

let dataLimite = localStorage.getItem('dataLimite');

function newData (){
    const data = new Date();
    data.setHours(6, 0, 0, 0);
    data.setDate(data.getDate() + 1); 
    dataLimite = data;
    localStorage.setItem('dataLimite', dataLimite.toISOString());
}

if (!dataLimite) {
    newData();
};

dataLimite = new Date(dataLimite);

const dataAtual = new Date();

if (dataAtual >= dataLimite) {
  coposRecomendados = Math.ceil(mediaInt / 250);
  chrome.runtime.sendMessage({ action: "stopTimer" });
  chrome.runtime.sendMessage({ action: "startTimer" });
  salvarDados();
  newData();
};

console.log(dataAtual);
console.log(dataLimite);
veraoCopos.innerHTML = (coposRecomendados + 2) + ' Copos';
invernoCopos.innerHTML = (coposRecomendados - 2) + ' Copos';
if (coposRecomendados - 2 < 0) invernoCopos.innerHTML = '1 Copos';


function salvarDados() {
    chrome.storage.local.set({ 'copos': coposRecomendados, 'mlTomados': mlTomados, 'mlFaltam': mlFaltam })
    
}


function lerDados() {
    chrome.storage.local.get(['copos', 'mlTomados', 'mlFaltam'], function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            
            if (result.copos !== undefined) {
                coposRecomendados = result.copos;

                mlTomados = result.mlTomados || 0; 
                mlFaltam = result.mlFaltam || (mediaInt - mlTomados); // Calcula mlFaltam se não estiver definido

                if (mlFaltam < 0) {
                    mlFaltam = 0;
                }
                salvarDados();

                carregarDados();
            }
        }
    });
}
lerDados();

function carregarDados() {
    recommended.innerHTML = coposRecomendados;
    mediaP.innerHTML = 'Média diária recomendada: ' + Math.round(media) + 'ml';
    checarZerou();
    tomou.innerHTML = 'Você tomou ' + mlTomados + 'ml hoje';
};

carregarDados();

function checarZerou(){
    if (!coposRecomendados <= 0){
        falta.innerHTML = 'Faltam ' + Math.round(mlFaltam) + 'ml hoje';
    } else {
        falta.innerHTML = 'Você atingiu sua meta diária, parabéns!'
    }
};

function beberCopo() {
    salvarDados();
    mlTomados += 250;
    mlFaltam -= 250;
    mlFaltam < 0 ? mlFaltam = 0 : mlFaltam;
    coposRecomendados > 0 ? coposRecomendados -= 1 : coposRecomendados = 0;
    carregarDados();
    checarZerou();  
};

chrome.notifications.onButtonClicked.addListener((notificationId,buttonIndex) => {
    if (buttonIndex === 0) beberCopo();
});

chrome.storage.local.get(['pageLoaded'], function (result) {
    if (result.pageLoaded === undefined) {
        chrome.runtime.sendMessage({ action: "startTimer" });
        chrome.storage.local.set({ 'pageLoaded': 'true'  })
    }
})

document.addEventListener('click', e => {
    el = e.target;
    if (el.classList.contains('recadastrar')){
        chrome.storage.local.clear();
        chrome.runtime.sendMessage({ action: "stopTimer" });
        window.location.href = "popup.html";
    }
})
beberCopo();

