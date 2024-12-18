// Song playlist data
const playlist = [
  {
    title: "ekati ekati ghabarlis na",
    artist: "Anjali Kulkarni",
    src: "music/song1.mp3",
    cover: "https://c.saavncdn.com/993/Aai-Aaj-Khup-Kahi-Sangaychay-Marathi-2022-20220709110626-500x500.jpg",
  },
  {
    title: "Song Title 2",
    artist: "Artist Name 2",
    src: "song2.mp3",
    cover: "cover2.jpg",
  },
  {
    title: "Song Title 3",
    artist: "Artist Name 3",
    src: "song3.mp3",
    cover: "cover3.jpg",
  },
];

// Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const coverImage = document.getElementById("cover-image");

let currentSongIndex = 0; // Start with the first song
let isPlaying = false;

// Load a song into the player
function loadSong(song) {
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
}

// Play or pause the song
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️"; // Change to play icon
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸️"; // Change to pause icon
  }
  isPlaying = !isPlaying;
});

// Play the next song
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length; // Loop back to the first song
  loadSong(playlist[currentSongIndex]);
  if (isPlaying) {
    audio.play(); // Automatically play the next song if already playing
  }
});

// Play the previous song
prevBtn.addEventListener("click", () => {
  currentSongIndex =
    (currentSongIndex - 1 + playlist.length) % playlist.length; // Loop to the last song
  loadSong(playlist[currentSongIndex]);
  if (isPlaying) {
    audio.play(); // Automatically play the previous song if already playing
  }
});

// Load the first song on page load
loadSong(playlist[currentSongIndex]);
