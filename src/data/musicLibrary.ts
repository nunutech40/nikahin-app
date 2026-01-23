export interface MusicTrack {
    id: string;
    title: string;
    artist: string;
    category: "Romantic" | "Classic" | "Jazz" | "Pop" | "Traditional" | "Acoustic";
    url: string;
}

export const MUSIC_LIBRARY: MusicTrack[] = [
    {
        id: "romantic-1",
        title: "Eternal Love (Piano)",
        artist: "Wedding Collection",
        category: "Romantic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: "romantic-2",
        title: "Falling in Love",
        artist: "Acoustic Solo",
        category: "Acoustic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: "classic-1",
        title: "Canon in D",
        artist: "Pachelbel",
        category: "Classic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: "jazz-1",
        title: "L-O-V-E Style",
        artist: "Sweet Jazz",
        category: "Jazz",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        id: "pop-1",
        title: "Marry You (Acoustic)",
        artist: "Cover Artist",
        category: "Pop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        id: "traditional-1",
        title: "Gending Sriwijaya",
        artist: "Indo Heritage",
        category: "Traditional",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    },
    {
        id: "romantic-3",
        title: "Beautiful Day",
        artist: "Orchestra",
        category: "Romantic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
    },
    {
        id: "classic-2",
        title: "Air on G String",
        artist: "Bach",
        category: "Classic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
    },
    {
        id: "acoustic-1",
        title: "Sweet Memories",
        artist: "Guitar Solo",
        category: "Acoustic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3"
    },
    {
        id: "pop-2",
        title: "Perfect Moment",
        artist: "Soft Pop",
        category: "Pop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
    }
];
