// Import songs (Hindi, English, Marathi) if not defined in this file
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
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const suggestionsList = document.getElementById("suggestions-list");
const downloadBtn = document.getElementById("download-btn");
const lockScreen = document.getElementById("lock-screen"); // Lock screen element
const lockSongTitle = document.getElementById("lock-song-title");
const lockArtistName = document.getElementById("lock-artist-name");
const lockCoverImage = document.getElementById("lock-cover");

// Utility function to format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
}

// Update song details
function updateSongDetails() {
  const song = currentSongs[currentSongIndex];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  audio.src = song.src;

  // Update lock screen details
  lockSongTitle.textContent = song.title;
  lockArtistName.textContent = song.artist;
  lockCoverImage.src = song.cover;

  // Lock screen visibility
  lockScreen.style.display = "block"; // Show lock screen
  setTimeout(() => lockScreen.style.display = "none", 3000); // Hide after 3 seconds
}

// Toggle play/pause
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶️"; // Play icon
  } else {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸️"; // Pause icon
  }
});

// Next song (Autoplay enabled)
nextBtn.addEventListener("click", () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * currentSongs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  }
  updateSongDetails();
  audio.play(); // Autoplay the next song
});

// Previous song
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  updateSongDetails();
});

// Update progress
function updateProgress() {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  progress.style.width = (currentTime / duration) * 100 + "%";
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

// Sync progress bar with audio
progressBar.addEventListener("click", (e) => {
  const progressBarWidth = progressBar.offsetWidth;
  const clickPosition = e.offsetX;
  const newTime = (clickPosition / progressBarWidth) * audio.duration;
  audio.currentTime = newTime;
});

// Handle shuffle button
document.getElementById("shuffle-btn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
});

// Handle repeat button
document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);
  audio.loop = isRepeat; // Enable/disable loop
});

// Handle download button
downloadBtn.addEventListener("click", () => {
  const song = currentSongs[currentSongIndex];
  const link = document.createElement("a");
  link.href = song.src;
  link.download = song.title + ".mp3";
  link.click();
});

// Search for a song and show suggestions
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase().trim();
  suggestionsList.innerHTML = ""; // Clear previous suggestions

  if (query) {
    const matches = currentSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );

    matches.forEach((song) => {
      const suggestionItem = document.createElement("li");
      suggestionItem.textContent = `${song.title} - ${song.artist}`;
      suggestionItem.addEventListener("click", () => {
        const index = currentSongs.findIndex(
          (s) => s.title === song.title && s.artist === song.artist
        );
        currentSongIndex = index;
        updateSongDetails();
        if (isPlaying) {
          audio.play();
        }
        searchBar.value = "";
        suggestionsList.innerHTML = "";
      });
      suggestionsList.appendChild(suggestionItem);
    });
  }
});

// Search Button Click
searchBtn.addEventListener("click", () => {
  const query = searchBar.value.toLowerCase().trim();
  if (!query) return;

  const songIndex = currentSongs.findIndex(
    (song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
  );

  if (songIndex !== -1) {
    currentSongIndex = songIndex;
    updateSongDetails();
    if (isPlaying) {
      audio.play();
    }
  } else {
    alert("No matching song found!");
  }

  searchBar.value = "";
  suggestionsList.innerHTML = "";
});

// Handle song change based on selected playlist buttons
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  updateSongDetails();
});

// Initialize the player
updateSongDetails();

// Audio event listeners
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", () => {
  nextBtn.click();
});
