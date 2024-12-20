// Import songs
import { songs } from './songs.js';

// Playlist variables
const originalPlaylist = [...songs]; // Keep the original playlist
let playlist = [...songs];
let currentSongIndex = 0;

// Audio player and control elements
const audio = document.querySelector("audio");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
const likeBtn = document.getElementById("like-btn");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search");

// State variables
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
const likedSongs = new Set();

// Utility functions
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function resetPlaylistOrder() {
  return [...originalPlaylist];
}

function loadSong(song) {
  document.getElementById("title").textContent = song.title;
  document.getElementById("artist").textContent = song.artist;
  document.getElementById("cover").src = song.cover || "default-cover.png";
  audio.src = song.src;
  updateMediaSession(song);
}

function updateMediaSession(song) {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: [
        { src: song.cover || "default-cover.png", sizes: "96x96", type: "image/png" },
      ],
    });
  }
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "Pause";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "Play";
}

function playNextSong() {
  currentSongIndex = isShuffle
    ? Math.floor(Math.random() * playlist.length)
    : (currentSongIndex + 1) % playlist.length;
  loadSong(playlist[currentSongIndex]);
  playSong();
}

function playPrevSong() {
  currentSongIndex =
    (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(playlist[currentSongIndex]);
  playSong();
}

// Event listeners
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener("click", playPrevSong);

nextBtn.addEventListener("click", playNextSong);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  playlist = isShuffle ? shuffleArray(playlist) : resetPlaylistOrder();
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

likeBtn.addEventListener("click", () => {
  const currentSong = playlist[currentSongIndex];
  if (likedSongs.has(currentSong.src)) {
    likedSongs.delete(currentSong.src);
    likeBtn.textContent = "❤️";
  } else {
    likedSongs.add(currentSong.src);
    likeBtn.textContent = "💖";
  }
});

audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  if (!isNaN(duration)) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
  }
});

audio.addEventListener("ended", () => {
  if (!isRepeat) playNextSong();
});

progressBar.addEventListener("click", (e) => {
  const barWidth = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / barWidth) * duration;
});

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();
  const foundIndex = playlist.findIndex(
    (song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
  );
  if (foundIndex !== -1) {
    currentSongIndex = foundIndex;
    loadSong(playlist[currentSongIndex]);
    playSong();
  }
});

// Initial load
loadSong(playlist[currentSongIndex]);

