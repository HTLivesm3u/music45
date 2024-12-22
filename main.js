import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

// State variables
let currentSongIndex = 0;
let isPlaying = false;
let currentPlaylist = hindiSongs;

// DOM Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
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

  // Reset progress
  progress.style.width = "0%";
  currentTimeEl.textContent = "0:00";
}

// Play or pause the song
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
  currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
  loadSong(currentPlaylist[currentSongIndex]);
  if (isPlaying) audio.play();
}

// Play the previous song
function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  loadSong(currentPlaylist[currentSongIndex]);
  if (isPlaying) audio.play();
}

// Update progress bar
function updateProgress() {
  const currentTime = audio.currentTime;
  const duration = audio.duration;

  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration || 0);
}

// Set progress by clicking on the progress bar
function setProgress(e) {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Search functionality
function searchSongs(query) {
  suggestionsList.innerHTML = "";
  if (!query) return;

  const results = currentPlaylist.filter(song =>
    song.title.toLowerCase().includes(query.toLowerCase()) ||
    song.artist.toLowerCase().includes(query.toLowerCase())
  );

  results.forEach(song => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => {
      currentSongIndex = currentPlaylist.indexOf(song);
      loadSong(song);
      audio.play();
      isPlaying = true;
      playPauseBtn.textContent = "⏸️";
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(li);
  });
}

// Toggle playlist menu
menuBtn.addEventListener("click", () => {
  playlistMenu.classList.toggle("active");
});

// Event listeners
playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", playPrevSong);
nextBtn.addEventListener("click", playNextSong);
audio.addEventListener("timeupdate", updateProgress);
progressBar.addEventListener("click", setProgress);
searchBar.addEventListener("input", () => searchSongs(searchBar.value.trim()));
searchBtn.addEventListener("click", () => searchSongs(searchBar.value.trim()));

// Load the first song
loadSong(currentPlaylist[currentSongIndex]);
