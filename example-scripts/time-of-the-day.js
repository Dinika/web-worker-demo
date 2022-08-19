let intervalId;

const start = () => {
    if (!intervalId) {

        sendCurrentTime();

        intervalId = setInterval(() => {
            sendCurrentTime();
        }, 1000);
    }
}

const sendCurrentTime = () => {
    const now = new Date();
    const formattedTime = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    postMessage(formattedTime);
}

const stop = () => {
    clearInterval(intervalId);
    intervalId = null;
}
