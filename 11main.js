import { hindiSongs, englishSongs, marathiSongs, teluguSongs } from './songs.js';

const genreContainer = document.querySelector(".genre-grid");
const footerPlayPause = document.getElementById("footer-play-pause");
const bannerPlayPauseBtn = document.getElementById("banner-play-pause");
const bannerPlayPauseIcon = bannerPlayPauseBtn?.querySelector("i"); // Selects <i>
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
const shuffleBtn = document.getElementById("shuffle-btn");

let currentSongIndex = 0;
let currentSongs = [];
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Create an audio element
const audio = new Audio();

// Function to handle genre button click and show the playlist
function showPlaylist(event) {
    const buttonId = event.currentTarget.id;
    currentSongs = getPlaylist(buttonId);

    genreContainer.classList.remove("genre-grid");
    genreContainer.classList.add("playlist-view");

    genreContainer.innerHTML = `
        <ul class="song-list">${generatePlaylistHTML(currentSongs)}</ul>
    `;

    document.querySelectorAll(".song-item").forEach((item, index) => {
        item.addEventListener("click", () => playSong(index));
    });

    history.pushState({ page: "playlist" }, "", "#playlist");
}

// Restore grid layout on home view
function restoreGenres() {
    genreContainer.classList.remove("playlist-view");
    genreContainer.classList.add("genre-grid");

    genreContainer.innerHTML = `
        <div class="genre-card gradient-1" id="hindi-btn">Hindi</div>
        <div class="genre-card gradient-2" id="english-btn">English</div>
        <div class="genre-card gradient-3" id="marathi-btn">Marathi</div>
        <div class="genre-card gradient-4" id="telugu-btn">Telugu</div>
    `;
    addEventListeners();
}

window.addEventListener("popstate", (event) => {
    if (!event.state || event.state.page !== "playlist") {
        restoreGenres();
    }
});

// Function to get playlist based on button clicked
function getPlaylist(buttonId) {
    return {
        "hindi-btn": hindiSongs,
        "english-btn": englishSongs,
        "marathi-btn": marathiSongs,
        "telugu-btn": teluguSongs
    }[buttonId] || [];
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
    updatePlayPauseButtons();
}

// Function to load song data
function loadSong(song) {
    audio.src = song.src;
    footerSongTitle.textContent = song.title;
    footerArtistName.textContent = song.artist;
    footerCoverImage.src = song.cover;
    bannerSongTitle.textContent = song.title;
    bannerArtistName.textContent = song.artist;
    bannerCoverImage.src = song.cover;

    updateMediaSession(song);

    audio.onloadedmetadata = () => {
        durationElem.textContent = formatTime(audio.duration);
    };

    if (isPlaying) {
        audio.play();
    }
}

// Format time (e.g., 3:45)
function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Play/Pause Toggle
footerPlayPause.addEventListener("click", togglePlayPause);
bannerPlayPauseBtn.addEventListener("click", togglePlayPause);

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
    updatePlayPauseButtons();
}

// Function to update play/pause buttons
function updatePlayPauseButtons() {
    const iconClass = isPlaying ? "fa-pause" : "fa-play";
    footerPlayPause.querySelector("i").className = `fas ${iconClass}`;
    bannerPlayPauseIcon.className = `fas ${iconClass}`;
}

// Next & Previous Song Controls
nextBtn.addEventListener("click", playNextSong);
prevBtn.addEventListener("click", playPrevSong);

function playNextSong() {
    currentSongIndex = isShuffle 
        ? Math.floor(Math.random() * currentSongs.length) 
        : (currentSongIndex + 1) % currentSongs.length;

    loadSong(currentSongs[currentSongIndex]);
    if (isPlaying) audio.play();
}

function playPrevSong() {
    currentSongIndex = isShuffle 
        ? Math.floor(Math.random() * currentSongs.length) 
        : (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;

    loadSong(currentSongs[currentSongIndex]);
    if (isPlaying) audio.play();
}

// Shuffle and Repeat Functionality
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
});

// Update progress bar
audio.ontimeupdate = () => {
    if (!isNaN(audio.duration)) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeElem.textContent = formatTime(audio.currentTime);
    }
};

// Seek functionality
progressBar.addEventListener("click", (e) => {
    if (!audio.duration || isNaN(audio.duration)) return;
    audio.currentTime = (e.offsetX / progressBar.clientWidth) * audio.duration;
});

// Auto play next song
audio.addEventListener("ended", () => {
    isRepeat ? audio.play() : playNextSong();
});

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
    musicBanner.style.display = musicBanner.style.display === "block" ? "none" : "block";
});

// Close music banner
closeBannerBtn.addEventListener("click", () => {
    musicBanner.style.display = "none";
});

// Event listener setup
function addEventListeners() {
    document.querySelectorAll(".genre-card").forEach(button => {
        button.addEventListener("click", showPlaylist);
    });
}

// Ensure DOM is ready before adding event listeners
document.addEventListener("DOMContentLoaded", addEventListeners);
