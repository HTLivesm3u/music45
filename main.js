import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let currentSongs = hindiSongs; // Default to Hindi songs

// HTML Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const coverImage = document.getElementById("cover-image");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// Utility function to format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
}

// Update song details
function updateSongDetails() {
  const song = currentSongs[currentSongIndex];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  audio.src = song.src;
}

// Play song
function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸️"; // Update play/pause button to pause
}

// Pause song
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶️"; // Update play/pause button to play
}

// Toggle play/pause
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Next song
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  updateSongDetails();
  playSong(); // Autoplay the next song
});

// Previous song
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  updateSongDetails();
  playSong(); // Autoplay the previous song
});

// Playlist button event listeners
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  updateSongDetails();
  playSong(); // Autoplay
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  updateSongDetails();
  playSong(); // Autoplay
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  updateSongDetails();
  playSong(); // Autoplay
});

// Initialize player
updateSongDetails();

// Audio event listeners
audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  progress.style.width = (currentTime / duration) * 100 + "%";
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

