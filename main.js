import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongs = hindiSongs;

const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const coverImage = document.getElementById('cover-image');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const downloadBtn = document.getElementById('download-btn');
const menuBtn = document.getElementById('menu-btn');
const playlistMenu = document.getElementById('playlist-menu');

// Utility function to format time
const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

// Load a song
const loadSong = song => {
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;

  if (isPlaying) {
    audio.play();
    playPauseBtn.textContent = '⏸️';
  }
};

// Toggle play/pause
const togglePlayPause = () => {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = '▶️';
  } else {
    audio.play();
    playPauseBtn.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
};

// Next song
const playNextSong = () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * currentSongs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  }
  loadSong(currentSongs[currentSongIndex]);
};

// Previous song
const playPrevSong = () => {
  currentSongIndex =
    (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
};

// Progress bar update
audio.addEventListener('timeupdate', () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

// Seek
progressBar.addEventListener('click', e => {
  const clickX = e.offsetX;
  audio.currentTime = (clickX / progressBar.clientWidth) * audio.duration;
});

// Toggle shuffle
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

// Toggle repeat
repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
});

// Download song
downloadBtn.addEventListener('click', () => {
  const song = currentSongs[currentSongIndex];
  alert(`Downloading: ${song.title}`);
});

// Playlist switching
menuBtn.addEventListener('click', () => {
  playlistMenu.classList.toggle('active');
});

// Playlist buttons
document.getElementById('hindi-btn').addEventListener('click', () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  loadSong(currentSongs[currentSongIndex]);
});

document.getElementById('english-btn').addEventListener('click', () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  loadSong(currentSongs[currentSongIndex]);
});

document.getElementById('marathi-btn').addEventListener('click', () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  loadSong(currentSongs[currentSongIndex]);
});

// Initial load
loadSong(currentSongs[currentSongIndex]);
