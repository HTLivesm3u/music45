// Playlist data (replace with your own data or import it)
const playlist = [
      { 
      title: "Jo Tum Mere Ho",
    artist: "Anuv Jain",
    src: "music/Jo Tum Mere Ho.mp3",
    cover: "https://c.saavncdn.com/401/Jo-Tum-Mere-Ho-Hindi-2024-20240731053953-500x500.jpg",
     },
  {
    title: "ekati ekati ghabarlis na",
    artist: "Anjali Kulkarni",
    src: "music/song1.mp3",
    cover: "https://imgs.search.brave.com/HVqjF7CWQpUU0UGZZaMtr67XIyOoIGuUrRJuGBv8z8I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1QllUaGlaV015/WmpRdFlUQXhaUzAw/TkdNMkxUZ3hOREF0/Tnpnd05HRmhOakUx/WkRJNVhrRXlYa0Zx/Y0djQC5qcGc",
  },
  {
    title: "AAI",
    artist: "Yogita Koli,Pravin Koli",
    src: "music/song2.mp3",
    cover: "https://c.saavncdn.com/621/Aai-Marathi-2022-20220505134712-500x500.jpg",
  },
  {
    title: "govyachya kinaryavar",
    artist: "pravin koli",
    src: "music/song3.mp3",
    cover: "music/song33.jpg",},
 
];

// Elements
const audio = document.getElementById("audio");
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
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
const likedSongs = new Set();

// Utility Functions
function loadSong(song) {
  document.getElementById("title").textContent = song.title;
  document.getElementById("artist").textContent = song.artist;
  document.getElementById("cover").src = song.cover || "default-cover.png";
  audio.src = song.src;
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

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Event Listeners
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener("click", () => {
  currentSongIndex =
    (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(playlist[currentSongIndex]);
  playSong();
});

nextBtn.addEventListener("click", () => {
  currentSongIndex = isShuffle
    ? Math.floor(Math.random() * playlist.length)
    : (currentSongIndex + 1) % playlist.length;
  loadSong(playlist[currentSongIndex]);
  playSong();
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  audio.loop = isRepeat;
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
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong();
  } else {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(playlist[currentSongIndex]);
    playSong();
  }
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
  } else {
    alert("Song not found!");
  }
});

// Initial setup
loadSong(playlist[currentSongIndex]);
