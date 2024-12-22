import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let currentSongs = hindiSongs;

// DOM Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const qualitySelect = document.getElementById("quality-select");

// Load Song
function loadSong(song) {
  const quality = qualitySelect.value;
  const src = quality === "low" ? song.srcLow : quality === "medium" ? song.src : song.srcHigh;

  audio.src = src;
  document.getElementById("song-title").textContent = song.title;
  document.getElementById("artist-name").textContent = song.artist;
  document.getElementById("cover-image").src = song.cover;

  if (isPlaying) {
    audio.play();
  }
}

// Quality Change Event
qualitySelect.addEventListener("change", () => {
  const currentSong = currentSongs[currentSongIndex];
  loadSong(currentSong);
});

// Initial Load
loadSong(currentSongs[currentSongIndex]);
