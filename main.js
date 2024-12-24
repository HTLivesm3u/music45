// Import song data (ensure songs.js contains the arrays: hindiSongs, englishSongs, marathiSongs)
import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

// Select DOM elements
const menuBtn = document.getElementById("menu-btn");
const playlistMenu = document.getElementById("playlist-menu");
const searchBar = document.getElementById("search-bar");
const suggestionsList = document.getElementById("suggestions-list");
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
const coverImage = document.getElementById("cover-image");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const progressBar = document.getElementById("progress");
const progressContainer = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// State variables
let currentPlaylist = [];
let currentIndex = 0;
let isPlaying = false;
let isShuffling = false;
let isRepeating = false;

// Initialize playlist buttons
document.getElementById("hindi-btn").addEventListener("click", () => setPlaylist(hindiSongs));
document.getElementById("english-btn").addEventListener("click", () => setPlaylist(englishSongs));
document.getElementById("marathi-btn").addEventListener("click", () => setPlaylist(marathiSongs));

// Toggle menu visibility
menuBtn.addEventListener("click", () => {
  playlistMenu.classList.toggle("active");
});

// Set playlist and load the first song
function setPlaylist(playlist) {
  currentPlaylist = playlist;
  currentIndex = 0;
  loadSong(currentPlaylist[currentIndex]);
  playlistMenu.classList.remove("active");
}

// Load a song into the player
function loadSong(song) {
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  audio.src = song.src;
}

// Play or pause the song
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

// Play the previous song
function playPrevious() {
  currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  loadSong(currentPlaylist[currentIndex]);
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸️";
}

// Play the next song
function playNext() {
  currentIndex = isShuffling
    ? Math.floor(Math.random() * currentPlaylist.length)
    : (currentIndex + 1) % currentPlaylist.length;

  loadSong(currentPlaylist[currentIndex]);
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸️";
}

// Update progress bar as the song plays
function updateProgress() {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Update current time
  currentTimeEl.textContent = formatTime(audio.currentTime);

  // Update duration
  if (!isNaN(audio.duration)) {
    durationEl.textContent = formatTime(audio.duration);
  }
}

// Seek to a specific point in the song
function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Shuffle and repeat toggles
shuffleBtn.addEventListener("click", () => {
  isShuffling = !isShuffling;
  shuffleBtn.style.color = isShuffling ? "#1db954" : "white";
});

repeatBtn.addEventListener("click", () => {
  isRepeating = !isRepeating;
  repeatBtn.style.color = isRepeating ? "#1db954" : "white";
  audio.loop = isRepeating;
});

// Format time in mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// Search bar functionality
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();
  suggestionsList.innerHTML = "";

  if (query) {
    const allSongs = [...hindiSongs, ...englishSongs, ...marathiSongs];
    const filteredSongs = allSongs.filter((song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    );

    filteredSongs.forEach((song) => {
      const li = document.createElement("li");
      li.textContent = `${song.title} - ${song.artist}`;

      li.addEventListener("click", () => {
        searchBar.value = "";
        suggestionsList.innerHTML = "";
        loadSong(song);
        audio.play();
        isPlaying = true;
        playPauseBtn.textContent = "⏸️";
      });

      suggestionsList.appendChild(li);
    });
  }
});

// Event listeners for player controls
playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", playPrevious);
nextBtn.addEventListener("click", playNext);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
audio.addEventListener("ended", playNext);

// Utility: Preload first playlist if available
if (hindiSongs.length) {
  setPlaylist(hindiSongs);
}
