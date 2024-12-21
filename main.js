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
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
const downloadBtn = document.getElementById("download-btn");
const hindiBtn = document.getElementById("hindi-btn");
const englishBtn = document.getElementById("english-btn");
const marathiBtn = document.getElementById("marathi-btn");

function updateSongDetails() {
  const song = currentSongs[currentSongIndex];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  audio.src = song.src;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
}

playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶️";
  } else {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸️";
  }
});

nextBtn.addEventListener("click", () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * currentSongs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  }
  updateSongDetails();
  audio.play();
});

prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  updateSongDetails();
});

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  progress.style.width = (currentTime / duration) * 100 + "%";
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

progressBar.addEventListener("click", (e) => {
  const progressBarWidth = progressBar.offsetWidth;
  const clickPosition = e.offsetX;
  const newTime = (clickPosition / progressBarWidth) * audio.duration;
  audio.currentTime = newTime;
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  audio.loop = isRepeat;
});

downloadBtn.addEventListener("click", () => {
  const song = currentSongs[currentSongIndex];
  const link = document.createElement("a");
  link.href = song.src;
  link.download = song.title + ".mp3";
  link.click();
});

hindiBtn.addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

englishBtn.addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

marathiBtn.addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

updateSongDetails();
