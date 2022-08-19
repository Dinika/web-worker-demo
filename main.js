const MESSAGES = {
    start: 'START',
    stop: 'STOP',
}

if (window.Worker) {
    let myWorker;
    let myWorkerUrl;


    const fileUploadBtn = document.getElementById('upload-file-button');
    const fileUploadInput = document.getElementById('upload-file-input');

    fileUploadBtn.addEventListener('click', e => {
        if (fileUploadInput) {
            fileUploadInput.click();
        }
    });

    fileUploadInput.addEventListener('change', async (e) => {
        if (myWorker) {
            cleanupWorker(myWorker, myWorkerUrl);
        }

        const workerFile = fileUploadInput.files[0];
        myWorkerUrl = URL.createObjectURL(workerFile);

        const text = await workerFile.text();

        myWorker = new Worker(myWorkerUrl);
        myWorker.onmessage = onWorkerMessage;
        myWorker.onerror = onWorkerError;
        myWorker.onmessageerror = onWorkerMessageError;
    });

    const receivedValueEl = document.querySelector('#incoming-value');

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

    const onWorkerMessage = (e) => {
        console.log('Message received from worker');
        receivedValueEl.textContent = e.data;
    }

    const onWorkerError = (e) => {
        console.log('Error received from worker', e);
        receivedValueEl.textContent = e.data;
    }

    const onWorkerMessageError = (e) => {
        console.log('Message error received from worker', e);
        receivedValueEl.textContent = e.data;
    }
}

const cleanupWorker = (worker, workerUrl) => {
    console.log('Stop currently running worker');
    worker.terminate();
    URL.revokeObjectURL(workerUrl);
}
