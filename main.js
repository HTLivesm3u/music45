// main.js
import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0; // Start with the first song
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
  if (isPlaying) {
    audio.play();
  }
}

// Play the previous song
function playPrevSong() {
  currentSongIndex =
    (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
  if (isPlaying) {
    audio.play();
  }
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
    loadSong(currentSongs[currentSongIndex]);
    audio.play();
  } else {
    playNextSong();
  }
});

// Search functionality
searchBtn.addEventListener("click", () => {
  const query = searchBar.value.trim().toLowerCase();
  const results = currentSongs.filter((song) =>
    song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
  );
  displaySearchResults(results);
});

// Display search suggestions
function displaySearchResults(results) {
  suggestionsList.innerHTML = "";
  results.forEach((result) => {
    const li = document.createElement("li");
    li.textContent = `${result.title} - ${result.artist}`;
    li.addEventListener("click", () => {
      loadSong(result);
      audio.play();
    });
    suggestionsList.appendChild(li);
  });
}

// Playlist selection buttons
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  loadSong(currentSongs[0]);
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  loadSong(currentSongs[0]);
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  loadSong(currentSongs[0]);
});

// Initial song load
loadSong(currentSongs[currentSongIndex]);

// Play/Pause button listener
playPauseBtn.addEventListener("click", togglePlayPause);

// Next/Previous buttons listener
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);
