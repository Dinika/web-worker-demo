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

        const workerFile = await createNormalizedFile(fileUploadInput.files[0]);
        myWorkerUrl = URL.createObjectURL(workerFile);

        myWorker = new Worker(myWorkerUrl);
        myWorker.onmessage = onWorkerMessage;
        myWorker.onerror = onWorkerError;
        myWorker.onmessageerror = onWorkerMessageError;
    });

    const createNormalizedFile = async (file) => {
        const fileScript = await file.text();
        const normalizedScript = `
            ${normalizationScript}
            
            ${fileScript}
        `;

        const normalizedBlob = new Blob([normalizedScript], { type: 'text/javascript' });
        return normalizedBlob;
    }

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
        myWorker.terminate();
    });

    const helpButton = document.querySelector('#help-button');
    const helpDialog = document.getElementById('help-dialog');
    helpButton.addEventListener('click', () => {
        helpDialog.showModal();
    });

    // Close dialog when close button is clicked
    const closeHelpButton = document.getElementById('close-help');
    closeHelpButton.addEventListener('click', (e) => {
        e.stopPropagation();
        helpDialog.close();
    })

    // Close dialog when backdrop is clicked
    helpDialog.addEventListener('click', () => {
        var rect = helpDialog.getBoundingClientRect();
        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            helpDialog.close();
        }
    })

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
} else {
    alert('Woops! Your browser does not support web workers which is kind of essential for this demo.')
}

const cleanupWorker = (worker, workerUrl) => {
    console.log('Stop currently running worker');
    worker.terminate();
    URL.revokeObjectURL(workerUrl);
}

const normalizationScript = `

onmessage = (e) => {
    console.log('Worker received message ', e.data);
    const msg = e.data;

    switch (msg) {
        case 'START':
            start();
            break;
        case 'STOP':
            stop();
            break;
        default:
            console.log('Unrecognized message received', msg);
    }

}

`;
