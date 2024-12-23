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

// Toggle the playlist menu visibility
menuBtn.addEventListener("click", () => {
  playlistMenu.classList.toggle("active");
  if (playlistMenu.classList.contains("active")) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);
    overlay.addEventListener("click", () => {
      playlistMenu.classList.remove("active");
      document.body.removeChild(overlay);
    });
  } else {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }
});

// Play/Pause Button
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
});

// Next Button
nextBtn.addEventListener("click", () => {
  playNextSong();
});

// Previous Button
prevBtn.addEventListener("click", () => {
  playPrevSong();
});

// Progress Bar Clicked
progressBar.addEventListener("click", (e) => {
  const width = progressBar.offsetWidth;
  const clickX = e.offsetX;
  const newTime = (clickX / width) * audio.duration;
  audio.currentTime = newTime;
});

// Update Progress Bar
audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const progressPercentage = (currentTime / duration) * 100;
  progress.style.width = `${progressPercentage}%`;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

// Format time to mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

// Shuffle and Repeat Toggle
document.getElementById("shuffle-btn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
});

document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);
});

// Download Song
downloadBtn.addEventListener("click", () => {
  const song = currentSongs[currentSongIndex];
  window.location.href = song.downloadUrl;  // Replace this with actual download URL
});

// Play Next Song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  playSong(currentSongs[currentSongIndex]);
}

// Play Previous Song
function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  playSong(currentSongs[currentSongIndex]);
}

// Play Song Function
function playSong(song) {
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.coverUrl;
  audio.src = song.audioUrl;
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸️";
}


// Load the first song on page load
loadSong(currentSongs[currentSongIndex]);
