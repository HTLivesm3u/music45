import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongs = hindiSongs; // Default playlist

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

// Format time function
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

// Update song info
function updateSongInfo(song) {
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  audio.src = song.url;
}

// Toggle play/pause
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

// Next song
function nextSong() {
  currentSongIndex = isShuffle ? Math.floor(Math.random() * currentSongs.length) : (currentSongIndex + 1) % currentSongs.length;
  updateSongInfo(currentSongs[currentSongIndex]);
  if (isPlaying) audio.play();
}

// Previous song
function prevSong() {
  currentSongIndex = isShuffle ? Math.floor(Math.random() * currentSongs.length) : (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  updateSongInfo(currentSongs[currentSongIndex]);
  if (isPlaying) audio.play();
}

// Update progress bar
function updateProgressBar() {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = progressPercent + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
}

// Shuffle songs
function toggleShuffle() {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle('active', isShuffle);
}

// Repeat song
function toggleRepeat() {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle('active', isRepeat);
}

// Download song
function downloadSong() {
  const a = document.createElement("a");
  a.href = audio.src;
  a.download = currentSongs[currentSongIndex].title + ".mp3";
  a.click();
}

// Event listeners
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
audio.addEventListener("timeupdate", updateProgressBar);
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.play();
  } else {
    nextSong();
  }
});
document.getElementById("shuffle-btn").addEventListener("click", toggleShuffle);
document.getElementById("repeat-btn").addEventListener("click", toggleRepeat);
downloadBtn.addEventListener("click", downloadSong);

// Handle search suggestions
searchBar.addEventListener("input", function () {
  const query = searchBar.value.toLowerCase();
  const suggestions = currentSongs.filter(song => song.title.toLowerCase().includes(query));
  suggestionsList.innerHTML = suggestions.map(song => `<li>${song.title} - ${song.artist}</li>`).join('');
});

// Playlist buttons
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  updateSongInfo(hindiSongs[currentSongIndex]);
});
document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  updateSongInfo(englishSongs[currentSongIndex]);
});
document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  updateSongInfo(marathiSongs[currentSongIndex]);
});

// Initial song
updateSongInfo(currentSongs[currentSongIndex]);
