import { hindiSongs, englishSongs, marathiSongs } from "./songs.js";

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongs = hindiSongs;

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
    playPauseBtn.textContent = "⏸️";
  }
}

// Play or pause functionality
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶️";
  } else {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸️";
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

// Automatically play the next song
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    playNextSong();
  }
});

// Shuffle functionality
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

// Repeat functionality
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

// Download functionality
downloadBtn.addEventListener("click", () => {
  const currentSong = currentSongs[currentSongIndex];
  const a = document.createElement("a");
  a.href = currentSong.src;
  a.download = `${currentSong.title}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Playlist selection
menuBtn.addEventListener("click", () => {
  playlistMenu.classList.toggle("active");
});

document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  loadSong(currentSongs[currentSongIndex]);
  isPlaying = true;
  audio.play();
  playPauseBtn.textContent = "⏸️";
  playlistMenu.classList.remove("active");
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  loadSong(currentSongs[currentSongIndex]);
  isPlaying = true;
  audio.play();
  playPauseBtn.textContent = "⏸️";
  playlistMenu.classList.remove("active");
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  loadSong(currentSongs[currentSongIndex]);
  isPlaying = true;
  audio.play();
  playPauseBtn.textContent = "⏸️";
  playlistMenu.classList.remove("active");
});

// Update lock screen media session
function updateMediaSession(song) {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: [{ src: song.cover, sizes: "512x512", type: "image/jpeg" }],
    });

    navigator.mediaSession.setActionHandler("play", togglePlayPause);
    navigator.mediaSession.setActionHandler("pause", togglePlayPause);
    navigator.mediaSession.setActionHandler("previoustrack", playPrevSong);
    navigator.mediaSession.setActionHandler("nexttrack", playNextSong);
  }
}

// Load the first song on page load
loadSong(currentSongs[currentSongIndex]);
