import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let currentSongs = hindiSongs; // Default playlist is Hindi

// HTML Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const coverImage = document.getElementById("cover-image");
const qualitySelect = document.getElementById("quality-select");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// Utility function to format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Load a song
function loadSong(song) {
  // Get the selected quality
  const selectedQuality = qualitySelect.value;

  // Set the audio source based on the selected quality
  audio.src = song.src[selectedQuality];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;

  // Update media session metadata
  updateMediaSession(song);

  // Play song if it's already playing
  if (isPlaying) {
    audio.play();
    playPauseBtn.textContent = "⏸️"; // Update play button to pause
  }
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
  currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
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
  playNextSong();
});

// Add event listeners for buttons
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

// Load the first song on page load
loadSong(currentSongs[currentSongIndex]);
