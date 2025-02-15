import { hindiSongs, englishSongs, marathiSongs, teluguSongs } from './songs.js';

const genreContainer = document.querySelector(".genre-grid");
const footerPlayPause = document.getElementById("footer-play-pause");
const bannerPlayPauseBtn = document.getElementById("banner-play-pause");
const bannerPlayPauseIcon = bannerPlayPauseBtn.querySelector("i"); // Selects <i>
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

    // Change display styles dynamically
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
    footerSongTitle.textContent = song.title;
    footerArtistName.textContent = song.artist;
    footerCoverImage.src = song.cover;
    bannerSongTitle.textContent = song.title;
    bannerArtistName.textContent = song.artist;
    bannerCoverImage.src = song.cover;
  
    // Update the media session whenever a song is loaded
    updateMediaSession(song);
  
    audio.onloadedmetadata = () => {
      durationElem.textContent = formatTime(audio.duration);
    };
  
    // If it's already playing, play the song
    if (isPlaying) {
      audio.play();
    }
    updateSongList();
}

// Format time (e.g., 3:45)
function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

// Shuffle and Repeat functionality
document.getElementById("shuffle-btn").addEventListener("click", () => {
    isShuffle = !isShuffle;
  
    // Toggle button active state
    document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
  
    // Show shuffle popup
    showShufflePopup(isShuffle);
  });

// Update progress bar
audio.ontimeupdate = () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeElem.textContent = formatTime(audio.currentTime);
};
// Function to show buffering icon
function showBannerLoading() {
    bannerPlayPauseIcon.classList.remove("fa-play", "fa-pause");
    bannerPlayPauseIcon.classList.add("fa-spinner", "fa-spin"); // Show loading spinner
    bannerPlayPauseBtn.disabled = true; // Disable button to prevent spam clicks
}

// Function to hide buffering icon and restore play/pause button
function hideBannerLoading() {
    bannerPlayPauseIcon.classList.remove("fa-spinner", "fa-spin");
    bannerPlayPauseBtn.disabled = false; // Enable button

    // Set the correct icon based on the play state
    if (isPlaying) {
        bannerPlayPauseIcon.classList.add("fa-pause");
    } else {
        bannerPlayPauseIcon.classList.add("fa-play");
    }
}

// Attach event listeners to handle buffering
audio.addEventListener("waiting", showBannerLoading);  // Song is buffering
audio.addEventListener("canplay", hideBannerLoading);  // Song can be played
audio.addEventListener("playing", hideBannerLoading);  // Song starts playing

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
            updatePlayPauseButtons(); // Ensure UI updates
        });

        navigator.mediaSession.setActionHandler('pause', () => {
            audio.pause();
            isPlaying = false;
            updatePlayPauseButtons(); // Ensure UI updates
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

// Function to update play/pause buttons in the footer and banner
function updatePlayPauseButtons() {
    if (isPlaying) {
        footerPlayPause.textContent = "⏸"; // Pause icon
        bannerPlayPause.innerHTML = `<i class="fas fa-pause"></i>`;
    } else {
        footerPlayPause.textContent = "▶️"; // Play icon
        bannerPlayPause.innerHTML = `<i class="fas fa-play"></i>`;
    }
}




addEventListeners();
