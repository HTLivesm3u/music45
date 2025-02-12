import { hindiSongs, englishSongs, marathiSongs, teluguSongs } from './songs.js';

const genreContainer = document.querySelector(".genre-grid");
const footerPlayPause = document.getElementById("footer-play-pause");
const bannerPlayPause = document.getElementById("banner-play-pause");
const footerSongTitle = document.getElementById("footer-song-title");
const footerArtistName = document.getElementById("footer-artist-name");
const footerCoverImage = document.getElementById("footer-cover-image");
const bannerSongTitle = document.getElementById("banner-song-title");
const bannerArtistName = document.getElementById("banner-artist-name");
const bannerCoverImage = document.getElementById("banner-cover-image");
const footerToggleBtn = document.getElementById("footer-song-info");

// Music banner controls
const musicBanner = document.getElementById("music-banner");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const currentTimeElem = document.getElementById("current-time");
const durationElem = document.getElementById("duration");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const downloadBtn = document.getElementById("download-btn");
const closeBannerBtn = document.getElementById("close-banner-btn");

let currentSongIndex = 0;
let currentSongs = [];
let isPlaying = false;
let isShuffle = false;

// Create an audio element
const audio = new Audio();

// Function to handle genre button click and show the playlist
function showPlaylist(event) {
    const buttonId = event.currentTarget.id;
    currentSongs = getPlaylist(buttonId);

    genreContainer.innerHTML = `
        
        <ul class="song-list">${generatePlaylistHTML(currentSongs)}</ul>
    `;


    document.querySelectorAll(".song-item").forEach((item, index) => {
        item.addEventListener("click", () => playSong(index));
    });

    history.pushState({ page: "playlist" }, "", "#playlist");
}

// Function to restore the genre buttons
function restoreGenres() {
    genreContainer.innerHTML = `
        <div class="genre-card gradient-1" id="hindi-btn">Hindi</div>
        <div class="genre-card gradient-2" id="english-btn">English</div>
        <div class="genre-card gradient-3" id="marathi-btn">Marathi</div>
        <div class="genre-card gradient-4" id="telugu-btn">Telugu</div>
    `;
    addEventListeners();
}

// Handle browser back navigation
window.addEventListener("popstate", (event) => {
    if (!event.state || event.state.page !== "playlist") {
        restoreGenres();
    }
});

// Function to get playlist based on button clicked
function getPlaylist(buttonId) {
    if (buttonId === "hindi-btn") return hindiSongs;
    if (buttonId === "english-btn") return englishSongs;
    if (buttonId === "marathi-btn") return marathiSongs;
    if (buttonId === "telugu-btn") return teluguSongs;
    return [];
}

// Function to generate playlist HTML
function generatePlaylistHTML(songs) {
    return songs.map((song, index) => `
        <li class="song-item" data-index="${index}">
            <img src="${song.cover}" alt="${song.title} Cover" class="song-cover">
            <span>${song.title} - ${song.artist}</span>
        </li>
    `).join("");
}

// Function to play a song
function playSong(index) {
    currentSongIndex = index;
    loadSong(currentSongs[currentSongIndex]);
    audio.play();
    isPlaying = true;
}

// Function to load song data
function loadSong(song) {
    audio.src = song.src;
    updateUI(song);
}

// Function to update UI with song details
function updateUI(song) {
    footerSongTitle.textContent = song.title;
    footerArtistName.textContent = song.artist;
    footerCoverImage.src = song.cover;
    bannerSongTitle.textContent = song.title;
    bannerArtistName.textContent = song.artist;
    bannerCoverImage.src = song.cover;

    footerPlayPause.textContent = "⏸";
    bannerPlayPause.innerHTML = `<i class="fas fa-pause"></i>`;
}

// Play/Pause Toggle
footerPlayPause.addEventListener("click", togglePlayPause);
bannerPlayPause.addEventListener("click", togglePlayPause);

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        footerPlayPause.textContent = "▶️";
        bannerPlayPause.innerHTML = `<i class="fas fa-play"></i>`;
    } else {
        audio.play();
        isPlaying = true;
        footerPlayPause.textContent = "⏸";
        bannerPlayPause.innerHTML = `<i class="fas fa-pause"></i>`;
    }
}

// Play next song
function playNextSong() {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * currentSongs.length);
        } while (randomIndex === currentSongIndex);

        currentSongIndex = randomIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
    }

    loadSong(currentSongs[currentSongIndex]);
    if (isPlaying) audio.play();
}

// Play previous song
function playPrevSong() {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * currentSongs.length);
        } while (randomIndex === currentSongIndex);

        currentSongIndex = randomIndex;
    } else {
        currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
    }

    loadSong(currentSongs[currentSongIndex]);
    if (isPlaying) audio.play();
}

// Next & Previous Buttons
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

// Download functionality
downloadBtn.addEventListener("click", () => {
    const currentSong = currentSongs[currentSongIndex];
    const link = document.createElement("a");
    link.href = currentSong.src;
    link.download = `${currentSong.title} - ${currentSong.artist}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Toggle music banner visibility
footerToggleBtn.addEventListener("click", () => {
    if (musicBanner.style.display === "block") {
        musicBanner.style.display = "none";
        history.pushState(null, null, window.location.href);
    } else {
        musicBanner.style.display = "block";
        history.pushState({ musicBannerOpen: true }, null, window.location.href);
    }
});

// Close the music banner when the close button is clicked
closeBannerBtn.addEventListener("click", () => {
    musicBanner.style.display = "none";
});

// Handle back button press to close music banner
window.addEventListener("popstate", () => {
    if (musicBanner.style.display === "block") {
        musicBanner.style.display = "none";
    }
});

// Initial event listener setup
function addEventListeners() {
    document.querySelectorAll(".genre-card").forEach(button => {
        button.addEventListener("click", showPlaylist);
    });
}

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

    // Handle mobile lock screen controls
    navigator.mediaSession.setActionHandler('play', () => {
      audio.play();
      isPlaying = true;
      updatePlayPauseButtons(); // Update UI buttons accordingly
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audio.pause();
      isPlaying = false;
      updatePlayPauseButtons();
    });

    navigator.mediaSession.setActionHandler('nexttrack', playNextSong);
    navigator.mediaSession.setActionHandler('previoustrack', playPrevSong);

    // Seek forward
    navigator.mediaSession.setActionHandler('seekforward', () => {
      audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    });

    // Seek backward
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    });
  }
}


addEventListeners();
