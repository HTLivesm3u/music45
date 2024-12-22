import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongs = hindiSongs; // Default playlist is Hindi

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
const qualitySelector = document.getElementById("quality");
const downloadBtn = document.getElementById("download-btn");

// Utility function to format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Load a song
function loadSong(song) {
  const quality = qualitySelector.value; // Get selected quality
  audio.src = `${song.src}?quality=${quality}`;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  if (isPlaying) audio.play();
}

// Play or pause
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
}

// Play next/previous
function playNextSong() {
  currentSongIndex = isShuffle
    ? Math.floor(Math.random() * currentSongs.length)
    : (currentSongIndex + 1) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
}

function playPrevSong() {
  currentSongIndex =
    (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
}

// Update progress
audio.addEventListener("timeupdate", () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

// Seek functionality
progressBar.addEventListener("click", (e) => {
  audio.currentTime = (e.offsetX / progressBar.offsetWidth) * audio.duration;
});

// Add event listeners
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

// Update playlist
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  loadSong(currentSongs[(currentSongIndex = 0)]);
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  loadSong(currentSongs[(currentSongIndex = 0)]);
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  loadSong(currentSongs[(currentSongIndex = 0)]);
});

// Download button
downloadBtn.addEventListener("click", () => {
  const song = currentSongs[currentSongIndex];
  const link = document.createElement("a");
  link.href = song.src;
  link.download = `${song.title}.mp3`;
  link.click();
});

// Load initial song
loadSong(currentSongs[currentSongIndex]);
