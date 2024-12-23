// script.js
import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongs = hindiSongs; // Default playlist is Hindi

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
const menuBtn = document.getElementById("menu-btn");
const playlistMenu = document.getElementById("playlist-menu");

// Utility function to format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Load a song
function loadSong(song) {
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  updateMediaSession(song); // Update lock screen metadata
  if (isPlaying) {
    audio.play();
    playPauseBtn.textContent = "⏸️"; // Update play button to pause
  }
}

// Play or pause functionality
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶️"; // Play icon
  } else {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸️"; // Pause icon
  }
}

// Play the next song
function playNextSong() {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * currentSongs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  }
  loadSong(currentSongs[currentSongIndex]);
}

// Play the previous song
function playPrevSong() {
  currentSongIndex =
    (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
}

// Update progress bar
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  // Update current time and duration
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

// Seek functionality
progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

// Automatically play the next song when the current one ends
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.play(); // Replay the current song
  } else {
    playNextSong();
  }
});

// Toggle the playlist menu visibility with sliding effect
menuBtn.addEventListener("click", () => {
  playlistMenu.classList.toggle("active");
});

// Close menu when clicking outside
document.addEventListener("click", (event) => {
  if (!playlistMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    playlistMenu.classList.remove("active");
  }
});

// Add event listeners for buttons
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

// Shuffle and Repeat functionality
document.getElementById("shuffle-btn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
});

document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);
});

// Playlist selection buttons
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  loadSong(hindiSongs[currentSongIndex]);
  playlistMenu.classList.remove("active");
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  loadSong(englishSongs[currentSongIndex]);
  playlistMenu.classList.remove("active");
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  loadSong(marathiSongs[currentSongIndex]);
  playlistMenu.classList.remove("active");
});

// Download functionality
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = audio.src;
  link.download = `${songTitle.textContent}.mp3`;
  link.click();
});

// Initial song load
loadSong(hindiSongs[currentSongIndex]);
