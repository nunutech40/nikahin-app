export interface MusicTrack {
    id: string;
    title: string;
    artist: string;
    category: "Romantic" | "Classic" | "Jazz" | "Pop" | "Traditional";
    url: string;
}

export const MUSIC_LIBRARY: MusicTrack[] = [
    {
        id: "romantic-1",
        title: "A Thousand Years (Instrumental)",
        artist: "Wedding Strings",
        category: "Romantic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder functionality
    },
    {
        id: "classic-1",
        title: "Canon in D",
        artist: "Pachelbel",
        category: "Classic",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: "jazz-1",
        title: "L-O-V-E",
        artist: "Jazz Quartet",
        category: "Jazz",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: "pop-1",
        title: "Marry You",
        artist: "Acoustic Cover",
        category: "Pop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        id: "traditional-1",
        title: "Gending Sriwijaya",
        artist: "Traditional Orchestra",
        category: "Traditional",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
];
