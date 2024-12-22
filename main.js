import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongs = hindiSongs;

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
const qualitySelect = document.getElementById("quality-select");

let currentQuality = qualitySelect.value;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function loadSong(song) {
  audio.src = song[currentQuality];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  updateMediaSession(song);
  if (isPlaying) {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  }
}

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

function playNextSong() {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * currentSongs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  }
  loadSong(currentSongs[currentSongIndex]);
}

function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
}

audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.play();
  } else {
    playNextSong();
  }
});

playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

document.getElementById("shuffle-btn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
});

document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);
});

function updateMediaSession(song) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: [
        { src: song.cover, sizes: '96x96', type: 'image/png' },
        { src: song.cover, sizes: '128x128', type: 'image/png' },
        { src: song.cover, sizes: '192x192', type: 'image/png' },
        { src: song.cover, sizes: '256x256', type: 'image/png' },
        { src: song.cover, sizes: '384x384', type: 'image/png' },
        { src: song.cover, sizes: '512x512', type: 'image/png' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => {
      audio.play();
      isPlaying = true;
      playPauseBtn.textContent = '⏸️';
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      audio.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶️';
    });
    navigator.mediaSession.setActionHandler('nexttrack', playNextSong);
    navigator.mediaSession.setActionHandler('previoustrack', playPrevSong);
  }
}

searchBtn.addEventListener("click", () => {
  const query = searchBar.value.toLowerCase();
  if (query) {
    const results = currentSongs.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    );
    suggestionsList.innerHTML = results.map(song => 
      `<li onclick="loadSong(${JSON.stringify(song)})">${song.title} - ${song.artist}</li>`
    ).join('');
  } else {
    suggestionsList.innerHTML = '';
  }
});

qualitySelect.addEventListener("change", () => {
  currentQuality = qualitySelect.value;
  loadSong(currentSongs[currentSongIndex]);
});

downloadBtn.addEventListener("click", () => {
  const song = currentSongs[currentSongIndex];
  const link = document.createElement("a");
  link.href = song[currentQuality];
  link.download = `${song.title} - ${song.artist}.mp3`;
  link.click();
});

function updatePlaylist(language) {
  switch(language) {
    case 'hindi':
      currentSongs = hindiSongs;
      break;
    case 'english':
      currentSongs = englishSongs;
      break;
    case 'marathi':
      currentSongs = marathiSongs;
      break;
  }
  loadSong(currentSongs[currentSongIndex]);
}

document.getElementById("hindi-btn").addEventListener("click", () => {
  updatePlaylist('hindi');
  document.getElementById("hindi-btn").classList.add("active");
  document.getElementById("english-btn").classList.remove("active");
  document.getElementById("marathi-btn").classList.remove("active");
});

document.getElementById("english-btn").addEventListener("click", () => {
  updatePlaylist('english');
  document.getElementById("english-btn").classList.add("active");
  document.getElementById("hindi-btn").classList.remove("active");
  document.getElementById("marathi-btn").classList.remove("active");
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  updatePlaylist('marathi');
  document.getElementById("marathi-btn").classList.add("active");
  document.getElementById("hindi-btn").classList.remove("active");
  document.getElementById("english-btn").classList.remove("active");
});

// Initial setup
updatePlaylist('hindi');
