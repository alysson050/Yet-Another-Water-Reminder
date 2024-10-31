const weightInput = document.querySelector('.userWeight');

function mudarPadrão() {
  chrome.storage.local.get('peso', function (result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      if (result.peso !== undefined) {
        const peso = result.peso;
        const media = peso * 35;
        window.location.href = "beba-agua.html?media=" + media;
      }
    }
  });
}

mudarPadrão();

function salvarPeso(peso) {
  chrome.storage.local.set({ 'peso': peso }, function () {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {function mudarPadrão() {
      // Recupere o valor do peso do armazenamento local
      chrome.storage.local.get('peso', function (result) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          // Verifique se o valor do peso foi recuperado com sucesso
          if (result.peso !== undefined) {
            const peso = result.peso;
            const media = peso * 35;
            window.location.href = "beba-agua.html?media=" + media;
          }
        }
      });
    }
      console.log('Peso salvo com sucesso!');
      redirecionarBebaAgua(peso);
    }
  });
}

function redirecionarBebaAgua(peso) {
  const media = peso * 35;
  window.location.href = "beba-agua.html?media=" + media;
}

document.addEventListener('click', e => {
  const el = e.target;
  e.preventDefault();
  if (el.classList.contains('sendBtn')) {
    if (weightInput.value === "") { 
      alert("Por favor, preencha o campo");
    } else if (weightInput.value < 20) {
      alert ("Valor de peso muito baixo")
    
    } else {
      const peso = parseFloat(weightInput.value);
      salvarPeso(peso);
    }
  }
});

