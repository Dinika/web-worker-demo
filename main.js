const MESSAGES = {
    start: 'START',
    stop: 'STOP',
}

if (window.Worker) {
    const myWorker = new Worker('./static-worker.js');
    const receivedValueEl = document.querySelector('#incoming-value');

    myWorker.onmessage = (e) => {
        console.log('Message received from worker');
        receivedValueEl.textContent = e.data;
    }


    const startButton = document.querySelector('#start-button');
    startButton.addEventListener('click', () => {
        console.log('Starting the worker');
        myWorker.postMessage(MESSAGES.start);
    });

    const stopButton = document.querySelector('#stop-button');
    stopButton.addEventListener('click', () => {
        console.log('Terminating the worker');
        myWorker.postMessage(MESSAGES.stop);

    });

    myWorker.onerror = (e) => {
        console.log('Error received from worker', e);
        receivedValueEl.textContent = e.data;
    }

    myWorker.onmessageerror = (e) => {
        console.log('Message error received from worker', e);
        receivedValueEl.textContent = e.data;
    }
}
