// main.js
import { songs } from './songs.js';

let currentSongIndex = 0; // Start with the first song
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// HTML Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const coverImage = document.getElementById("cover-image");

// Load a song
function loadSong(song) {
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  // audio.play();
  // isPlaying = true;
  // playPauseBtn.textContent = "⏸️";
  // updateMediaSession(song); // Optional: Update media session for lock screen
}

// Play or pause the song
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
});

// Next song
nextBtn.addEventListener("click", () => {
  if (isShuffle) {
    playNextRandomSong();
  } else {
    playNextSong();
  }
});

// Previous song
prevBtn.addEventListener("click", () => {
  currentSongIndex =
    (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  if (isPlaying) audio.play();
});

// Play next random song
function playNextRandomSong() {
  currentSongIndex = Math.floor(Math.random() * songs.length);
  loadSong(songs[currentSongIndex]);
}

// Play next sequential song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
}

// Shuffle mode toggle
document.getElementById("shuffle-btn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
});

// Repeat mode toggle
document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);
  audio.loop = isRepeat;
});

// Automatically play the next song or shuffle
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.play();
  } else if (isShuffle) {
    playNextRandomSong();
  } else {
    playNextSong();
  }
});

// Media session API for lock screen
function updateMediaSession(song) {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: [
        { src: song.cover, sizes: "96x96", type: "image/jpeg" },
        { src: song.cover, sizes: "128x128", type: "image/jpeg" },
      ],
    });
  }
}

// Load the initial song
loadSong(songs[currentSongIndex]);
