const { Observable, startWith } = rxjs;

const MESSAGES = {
    start: 'START',
    stop: 'STOP',
}

if (window.Worker) {
    let myWorker;
    let workerValues$;
    let workerValuesSubscription;

    const fileUploadBtn = document.getElementById('upload-file-button');
    const fileUploadInput = document.getElementById('upload-file-input');

    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');

    const receivedValueEl = document.getElementById('incoming-value');

    const helpButton = document.getElementById('help-button');
    const helpDialog = document.getElementById('help-dialog');
    const closeHelpButton = document.getElementById('close-help');

    fileUploadBtn.addEventListener('click', e => {
        if (fileUploadInput) {
            fileUploadInput.click();
        }
    });

    fileUploadInput.addEventListener('change', async () => {
        const workerFile = await createNormalizedFile(fileUploadInput.files[0]);
        const myWorkerUrl = URL.createObjectURL(workerFile);

        workerValues$ = new Observable(subscriber => {
            // Intialize the observer
            myWorker = new Worker(myWorkerUrl);

            // Setup handlers for incoming message / error
            myWorker.onmessage = e => onWorkerMessage(e, subscriber);
            myWorker.onerror = e => onWorkerError(e, subscriber);
            myWorker.onmessageerror = e => onWorkerMessageError(e, subscriber);

            // Setup teardown logic
            return () => cleanupWorker(myWorker, myWorkerUrl);
        });

        toggleDisablityOfButtons({ enable: [startButton], disable: [fileUploadBtn, stopButton] });
    });

    startButton.addEventListener('click', () => {
        workerValuesSubscription = workerValues$.subscribe(val => receivedValueEl.textContent = val);
        myWorker.postMessage(MESSAGES.start);

        toggleDisablityOfButtons({ enable: [stopButton], disable: [fileUploadBtn, startButton] });
    });

    stopButton.addEventListener('click', () => {
        workerValuesSubscription.unsubscribe();
        workerValues$ = null;
        workerValuesSubscription = null;

        toggleDisablityOfButtons({ enable: [fileUploadBtn], disable: [startButton, stopButton] });
    });

    helpButton.addEventListener('click', () => {
        helpDialog.showModal();
    });

    // Close dialog when close button is clicked
    closeHelpButton.addEventListener('click', (e) => {
        e.stopPropagation();
        helpDialog.close();
    });

    // Close dialog when backdrop is clicked
    helpDialog.addEventListener('click', (event) => {
        var rect = helpDialog.getBoundingClientRect();
        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            helpDialog.close();
        }
    });

    const onWorkerMessage = (e, subscriber) => {
        console.log('Message received from worker', e);
        subscriber.next(e.data);
    }

    const onWorkerError = (e, subscriber) => {
        console.log('Error received from worker', e);
        subscriber.next(e.data);
    }

    const onWorkerMessageError = (e, subscriber) => {
        console.log('Message error received from worker', e);
        subscriber.next(e.data);
    }
} else {
    alert('Woops! Your browser does not support web workers which is kind of essential for this demo.');
}

const cleanupWorker = (worker, workerUrl) => {
    // Allow the worker to do some cleanup
    worker.postMessage(MESSAGES.stop);

    worker.terminate();

    URL.revokeObjectURL(workerUrl);
}

const createNormalizedFile = async (file) => {
    const fileScript = await file.text();
    const normalizedScript = `
        ${normalizationScript}
        
        ${fileScript}
    `;

    const normalizedBlob = new Blob([normalizedScript], { type: 'text/javascript' });
    return normalizedBlob;
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

const toggleDisablityOfButtons = ({ enable, disable }) => {
    enable.forEach(element => {
        element.removeAttribute('disabled');
    });


    disable.forEach(element => {
        element.setAttribute('disabled', 'true');
    });
}
