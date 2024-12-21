import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
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
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const suggestionsList = document.getElementById("suggestions-list");
const downloadBtn = document.getElementById("download-btn");

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

// Toggle play/pause
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶️"; // Play icon
  } else {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸️"; // Pause icon
  }
});

// Next song (Autoplay enabled)
nextBtn.addEventListener("click", () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * currentSongs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  }
  updateSongDetails();
  audio.play(); // Autoplay the next song
});

// Previous song
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  updateSongDetails();
});

// Update progress
function updateProgress() {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  progress.style.width = (currentTime / duration) * 100 + "%";
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

// Sync progress bar with audio
progressBar.addEventListener("click", (e) => {
  const progressBarWidth = progressBar.offsetWidth;
  const clickPosition = e.offsetX;
  const newTime = (clickPosition / progressBarWidth) * audio.duration;
  audio.currentTime = newTime;
});

// Handle shuffle button
document.getElementById("shuffle-btn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
});

// Handle repeat button
document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);
  audio.loop = isRepeat; // Enable/disable loop
});

// Handle download button
downloadBtn.addEventListener("click", () => {
  const song = currentSongs[currentSongIndex];
  const link = document.createElement("a");
  link.href = song.src;
  link.download = song.title + ".mp3";
  link.click();
});

// Handle song change based on selected playlist buttons
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

// Initialize the player
updateSongDetails();

// Audio event listeners
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", () => {
  nextBtn.click();
});
