const songs = [
    'Under Pressure',
    'We Will Rock You',
    'A Kind of Magic',
    'Bicycle',
    'Love of my Life',
    'Bohemian Rhapsody',
    'Barcelona',
    'Made in Heaven',
    'Radio Gaga',
    'Keep Yourself Alive',
    'Dont Stop me now'
];

let intervalId;

onmessage = (e) => {
    console.log('Worker received message ', e.data);
    const msg = e.data;

    switch (msg) {
        case 'START':
            startSendingSongs();
            break;
        case 'STOP':
            stopSendingSongs();
            break;
        default:
            console.log('Unrecognized message received', msg);
    }

}

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

const startSendingSongs = () => {
    if (!intervalId) {
        console.log('Starting interval')
        intervalId = setInterval(() => {
            const songOfTheMoment = songs[randomNumber(0, songs.length)];
            console.log('Going to post ', songOfTheMoment);

            postMessage(songOfTheMoment);

        }, 2000);
    } else {
        console.log('Already sending messages');
    }
}

const stopSendingSongs = () => {
    console.log('Clearing Interval', intervalId);
    clearInterval(intervalId);
    intervalId = null;
}