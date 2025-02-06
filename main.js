import { hindiSongs, englishSongs, marathiSongs, teluguSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let currentSongs = hindiSongs; // Default playlist is Hindi

// HTML Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const songTitle = document.getElementById("current-song-title");
const artistName = document.getElementById("current-artist-name");
const coverImage = document.getElementById("current-cover-image");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const suggestionsList = document.getElementById("suggestions-list");
const menuBtn = document.getElementById("menu-btn");
const playlistMenu = document.getElementById("playlist-menu");
const songList = document.getElementById("song-list");

// Footer Elements
const footerPlayPauseBtn = document.getElementById("footer-play-pause");
const footerToggleBtn = document.getElementById("footer-toggle");
const footerSongTitle = document.getElementById("footer-song-title");
const footerArtistName = document.getElementById("footer-artist-name");
const footerCoverImage = document.getElementById("footer-cover-image");
const footerControls = document.getElementById("footer-controls");

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
  footerSongTitle.textContent = song.title;
  footerArtistName.textContent = song.artist;
  footerCoverImage.src = song.cover;
  updateSongList();
  if (isPlaying) {
    audio.play();
    playPauseBtn.textContent = "⏸️"; // Update play button to pause
  }
}

// Update the song list with cover images
function updateSongList() {
  songList.innerHTML = "";  // Clear the current list
  currentSongs.forEach((song, index) => {
    const li = document.createElement("li");
    const coverImg = document.createElement("img");
    coverImg.src = song.cover;
    coverImg.alt = song.title + " Cover";
    coverImg.classList.add("song-cover");  // Add a class for styling

    const songDetails = document.createElement("span");
    songDetails.textContent = `${song.title} - ${song.artist}`;

    li.appendChild(coverImg);
    li.appendChild(songDetails);
    
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(song);
      if (isPlaying) {
        audio.play();
      }
    });

    songList.appendChild(li);
  });
}

// Play or pause functionality
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶️"; // Play icon
    footerPlayPauseBtn.textContent = "▶️";
  } else {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸️"; // Pause icon
    footerPlayPauseBtn.textContent = "⏸️";
  }
}

// Play the next song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  loadSong(currentSongs[currentSongIndex]);
  if (isPlaying) {
    audio.play();
  }
}

// Play the previous song
function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
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

// Search functionality
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

// Hide suggestions list when clicking outside
document.addEventListener("click", (event) => {
  const isClickInside = searchBar.contains(event.target) || suggestionsList.contains(event.target);

  if (!isClickInside) {
    suggestionsList.innerHTML = ""; // Clear suggestions list
  }
});

// Handle end of song
audio.addEventListener("ended", () => {
  playNextSong();
});

// Event listeners for control buttons
playPauseBtn.addEventListener("click", togglePlayPause);
footerPlayPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

// Menu button to toggle the playlist menu
menuBtn.addEventListener("click", () => {
  playlistMenu.classList.toggle("active");
});

document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  loadSong(hindiSongs[0]);
  playlistMenu.classList.remove("active");  // Close the menu
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  loadSong(englishSongs[0]);
  playlistMenu.classList.remove("active");  // Close the menu
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  loadSong(marathiSongs[0]);
  playlistMenu.classList.remove("active");  // Close the menu
});

document.getElementById("telugu-btn").addEventListener("click", () => {
  currentSongs = teluguSongs;
  currentSongIndex = 0;
  loadSong(teluguSongs[0]);
  playlistMenu.classList.remove("active");  // Close the menu
});

// Close menu when clicking outside
document.addEventListener("click", (event) => {
  if (!playlistMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    playlistMenu.classList.remove("active");
  }
});

// Initialize with the first song of the Hindi playlist
loadSong(hindiSongs[currentSongIndex]);

// Function for searching songs
searchBtn.addEventListener("click", () => {
  const query = searchBar.value.toLowerCase();
  const suggestions = currentSongs.filter(song => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query));
  suggestionsList.innerHTML = "";
  suggestions.forEach(song => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => {
      loadSong(song);
    });
    suggestionsList.appendChild(li);
  });
});

// Toggle footer controls
footerToggleBtn.addEventListener("click", () => {
  footerControls.style.display = footerControls.style.display === "none" ? "flex" : "none";
});