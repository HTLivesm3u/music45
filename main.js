import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

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
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const suggestionsList = document.getElementById("suggestions-list");

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
  currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
  if (isPlaying) audio.play();
}

// Play the previous song
function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
  if (isPlaying) audio.play();
}

// Search functionality
function searchSongs(query) {
  suggestionsList.innerHTML = ""; // Clear suggestions
  if (query === "") return; // Exit if no input

  const results = currentSongs.filter(song =>
    song.title.toLowerCase().includes(query.toLowerCase()) ||
    song.artist.toLowerCase().includes(query.toLowerCase())
  );

  results.forEach(song => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => {
      currentSongIndex = currentSongs.indexOf(song);
      loadSong(song);
      isPlaying = true;
      playPauseBtn.textContent = "⏸️";
      audio.play();
      suggestionsList.innerHTML = ""; // Clear suggestions
    });
    suggestionsList.appendChild(li);
  });
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const query = searchBar.value.trim();
  searchSongs(query);
});

searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim();
  searchSongs(query);
});

playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

// Initialize with first song
loadSong(currentSongs[currentSongIndex]);
