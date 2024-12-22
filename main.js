import { hindiSongs, englishSongs, marathiSongs } from './songs.js';

let currentSongIndex = 0; // Start with the first song
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongs = hindiSongs; // Default playlist is Hindi

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
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * currentSongs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  }
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
  if (isRepeat) {
    audio.play(); // Replay the current song
  } else {
    playNextSong();
  }
});

// Add event listeners for buttons
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

// Shuffle and Repeat functionality
document.getElementById("shuffle-btn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
});

document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);
});

// Update lock screen media information
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

    // Handle media session actions (play, pause, next, previous)
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
        loadSong(song);
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
    loadSong(currentSongs[currentSongIndex]);
    if (isPlaying) {
      audio.play();
    }
  } else {
    alert("No matching song found!");
  }

  searchBar.value = "";
  suggestionsList.innerHTML = "";
});

// Playlist selection buttons
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0; // Reset index to 0 (start with first song)
  loadSong(currentSongs[currentSongIndex]);
  isPlaying = true; // Set the state to playing
  playPauseBtn.textContent = "⏸️"; // Set button to pause icon
  audio.play(); // Auto-play the first song
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0; // Reset index to 0 (start with first song)
  loadSong(currentSongs[currentSongIndex]);
  isPlaying = true; // Set the state to playing
  playPauseBtn.textContent = "⏸️"; // Set button to pause icon
  audio.play(); // Auto-play the first song
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0; // Reset index to 0 (start with first song)
  loadSong(currentSongs[currentSongIndex]);
  isPlaying = true; // Set the state to playing
  playPauseBtn.textContent = "⏸️"; // Set button to pause icon
  audio.play(); // Auto-play the first song
});

// Add event listener for the download button
downloadBtn.addEventListener("click", () => {
  const currentSong = currentSongs[currentSongIndex]; // Get the current song
  const link = document.createElement("a");
  link.href = currentSong.src;  // Set the link to the song's source
  link.download = currentSong.title + " - " + currentSong.artist + ".mp3"; // Set the filename for download
  document.body.appendChild(link); // Append link to body
  link.click(); // Trigger the download
  document.body.removeChild(link); // Remove the link after the click
});

// Load the first song on page load
loadSong(currentSongs[currentSongIndex]);
