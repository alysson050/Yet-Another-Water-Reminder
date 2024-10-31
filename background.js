chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.action === "notificar") {
        const notificationId = await createNotification();
    }
});

chrome.alarms.onAlarm.addListener(async function (alarm) {
    if (alarm.name === "reenviarNotificacao") {
        await resendNotification();
    }
});

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
        if (message.action === "stopTimer") {
            clearInterval(timer);
        }
    });
    if (message.action === "startTimer") {
        console.log("Loaded");
        var timer = setInterval(async function createNotification() {
            chrome.storage.local.get(['copos'], function (result) {
                console.log(result.copos);
                if ((result.copos -1) <= 0){
                    console.log("zerou");
                    clearInterval(timer);
                };
            });
                return new Promise((resolve) => {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: chrome.runtime.getURL("icons/16.png"),
                        title: "Hora de beber água!",
                        message: "Lembre-se de se manter hidratado.",
                        buttons: [
                            { title: "Beber agora" },
                            { title: "Adiar 10 minutos" }   
                        ]
                    }, function (notificationId) {
                        chrome.notifications.onButtonClicked.addListener(async function (clickedNotificationId, buttonIndex) {
                            if (clickedNotificationId === notificationId) {
                                if (buttonIndex === 0) {
                                    function diminuirUmCopo() {
                                        return new Promise((resolve, reject) => {
                                            chrome.storage.local.get(['copos', 'mlFaltam', 'mlTomados'], function (result) {
                                                if (chrome.runtime.lastError) {
                                                    console.error(chrome.runtime.lastError);
                                                    reject(chrome.runtime.lastError);
                                                } else {
                                                    if (result.copos !== undefined && result.copos > 0) {
                                                        const coposAtualizados = result.copos - 1;
                                                        const mlFaltamUpd = result.mlFaltam - 250;
                                                        const mlTomadosUpd = result.mlTomados + 250;
                                                        chrome.storage.local.set({ 'copos': coposAtualizados, 'mlFaltam': mlFaltamUpd, 'mlTomados': mlTomadosUpd }, function () {
                                                            if (chrome.runtime.lastError) {
                                                                console.error(chrome.runtime.lastError);
                                                                reject(chrome.runtime.lastError);
                                                            } else {
                                                                resolve({
                                                                    coposAtualizados: coposAtualizados,
                                                                    mlFaltamUpd: mlFaltamUpd,
                                                                    mlTomadosUpd: mlTomadosUpd
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        resolve(result.copos);
                                                    }
                                                }
                                            });
                                        });
                                    }
                                    diminuirUmCopo().then((result) => {
                                        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                                            if (message === 'update-dom') {
                                            const response = {
                                                coposAtualizados: result.coposAtualizados,
                                                mlFaltamUpd: result.mlFaltamUpd,
                                                mlTomadosUpd: result.mlTomadosUpd
                                            }  
                                            sendResponse(response);
                                            }
                                        });
                                    chrome.notifications.clear(notificationId);})
                                } else if (buttonIndex === 1) {
                                    setTimeout(function () {
                                        resendNotification();
                                    },  600000); 
                                    chrome.notifications.clear(notificationId);
                                }
                            }
                        });
                        resolve(notificationId);
                    });
                });
            },10000)
    }
});

async function resendNotification() {
    const notificationId = await createNotification();
}
