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

const start = (i) => {
    return songs[i < songs.length ? i : 0];
}
