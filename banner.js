
import { hindiSongs, englishSongs, marathiSongs, teluguSongs } from './songs.js';

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

updatePlaylistName('Hindi Songs');

//header content
const suggestionsList = document.getElementById("suggestions-list");
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const menuBtn = document.getElementById("menu-btn");
const betaBtn = document.getElementById("beta")
const playlistMenu = document.getElementById("playlist-menu");
const songList = document.getElementById("song-list");

// Footer controls
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("footer-play-pause");
const footerToggleBtn = document.getElementById("footer-song-info");
const footerSongTitle = document.getElementById("footer-song-title");
const footerArtistName = document.getElementById("footer-artist-name");
const footerCoverImage = document.getElementById("footer-cover-image");

// Music banner controls
const musicBanner = document.getElementById("music-banner");
const bannerPlayPauseBtn = document.getElementById("banner-play-pause");
const bannerSongTitle = document.getElementById("banner-song-title");
const bannerArtistName = document.getElementById("banner-artist-name");
const bannerCoverImage = document.getElementById("banner-cover-image");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const currentTimeElem = document.getElementById("current-time");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const durationElem = document.getElementById("duration");
const downloadBtn = document.getElementById("download-btn");
const closeBannerBtn = document.getElementById("close-banner-btn");

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


// Update the song list with a "Now Playing" indicator
function updateSongList() {
  songList.innerHTML = ""; // Clear the current list

  currentSongs.forEach((song, index) => {
    const li = document.createElement("li");
    const coverImg = document.createElement("img");
    coverImg.src = song.cover;
    coverImg.alt = song.title + " Cover";
    coverImg.classList.add("song-cover");

    const songDetails = document.createElement("span");
    songDetails.textContent = `${song.title} - ${song.artist}`;

    li.appendChild(coverImg);
    li.appendChild(songDetails);

    // Add the "Now Playing" indicator
    if (index === currentSongIndex) {
      const nowPlayingIcon = document.createElement("img");
      nowPlayingIcon.src = "/music/nowplaying.png"; // Replace with your image path
      nowPlayingIcon.alt = "Now Playing";
      nowPlayingIcon.classList.add("now-playing-icon");
      li.appendChild(nowPlayingIcon);

      // Add a green border to indicate the current song
      li.style.border = "2px solid green";
    }

    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongs[currentSongIndex]);
    });

    songList.appendChild(li);
  });
}



// Play/Pause function
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶️";
    bannerPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸️";
    bannerPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
}
function updatePlayPauseButtons() {
  if (isPlaying) {
    playPauseBtn.textContent = "⏸️";
    bannerPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    playPauseBtn.textContent = "▶️";
    bannerPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}




// Update progress bar
audio.ontimeupdate = () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeElem.textContent = formatTime(audio.currentTime);
};
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

      // Create cover image
      const coverImg = document.createElement("img");
      coverImg.src = song.cover;
      coverImg.alt = `${song.title} Cover`;
      coverImg.classList.add("suggestion-cover");

      // Create song details text
      const songDetails = document.createElement("span");
      songDetails.textContent = `${song.title} - ${song.artist}`;

      // Append elements
      suggestionItem.appendChild(coverImg);
      suggestionItem.appendChild(songDetails);

      // Click event to load the selected song
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
        suggestionsList.innerHTML = ""; // Clear suggestions
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

// Add event listeners for buttons
playPauseBtn.addEventListener("click", togglePlayPause);
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

function showShufflePopup(isEnabled) {
  const popup = document.getElementById("shuffle-popup");
  const statusText = document.getElementById("shuffle-status");

  statusText.textContent = isEnabled ? "ON" : "OFF";
  popup.classList.add("active");

  // Hide after 2 seconds
  setTimeout(() => {
    popup.classList.remove("active");
  }, 2000);
}

document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;

  // Toggle button active state
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);

  // Show Repeat popup
  showRepeatPopup(isRepeat);
});

function showRepeatPopup(isEnabled) {
  const popup = document.getElementById("repeat-popup");
  const statusText = document.getElementById("repeat-status");

  statusText.textContent = isEnabled ? "ON" : "OFF";
  popup.classList.add("active");

  // Hide after 2 seconds
  setTimeout(() => {
    popup.classList.remove("active");
  }, 2000);
}


footerToggleBtn.addEventListener("click", () => {
  if (musicBanner.style.display === "block") {
    musicBanner.style.display = "none"; // Close the music banner
    history.pushState(null, null, window.location.href); // Update browser history
  } else {
    musicBanner.style.display = "block"; // Open the music banner
    history.pushState({ musicBannerOpen: true }, null, window.location.href); // Update browser history
  }
});


window.addEventListener("popstate", () => {
  // Check if the music banner is open
  if (musicBanner.style.display === "block") {
    musicBanner.style.display = "none"; // Close the music banner
  }
});

// Close the Music Banner when the close button is clicked
closeBannerBtn.addEventListener("click", () => {
  // Hide the music banner
  musicBanner.style.display = "none";
});
// Download functionality
downloadBtn.addEventListener("click", () => {
  const currentSong = currentSongs[currentSongIndex];
  const link = document.createElement("a");
  link.href = currentSong.src;
  link.download = `${currentSong.title} - ${currentSong.artist}.`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Initialize song
let currentSongs = hindiSongs; // Default to Hindi songs
loadSong(currentSongs[currentSongIndex]);

// Play/Pause button in footer
playPauseBtn.addEventListener("click", togglePlayPause);

// Play/Pause button in banner
bannerPlayPauseBtn.addEventListener("click", togglePlayPause);

// Next button functionality
nextBtn.addEventListener("click", playNextSong);


// Play next song
function playNextSong() {
  if (isShuffle) {
    // Pick a random song that is not the current song
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * currentSongs.length);
    } while (randomIndex === currentSongIndex); // Ensure it's not the same song

    currentSongIndex = randomIndex;
  } else {
    // Standard next song behavior (sequential)
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
  }
  
  loadSong(currentSongs[currentSongIndex]);
  if (isPlaying) {
    audio.play();
  }
}


function playPrevSong() {
  if (isShuffle) {
    // Pick a random previous song
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * currentSongs.length);
    } while (randomIndex === currentSongIndex); // Ensure it's not the same song

    currentSongIndex = randomIndex;
  } else {
    // Standard previous song behavior (sequential)
    currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
  }

  loadSong(currentSongs[currentSongIndex]);
  if (isPlaying) {
    audio.play();
  }
}


// Menu button to toggle the playlist menu
menuBtn.addEventListener("click", () => {
  playlistMenu.classList.toggle("active");
});
// Initialize song list with the playlist name
function updatePlaylistName(playlistName) {
  const playlistNameElem = document.getElementById("playlist-name");
  playlistNameElem.textContent = `Current Playlist: ${playlistName}`;
}

// Change the playlist when a button is clicked
document.getElementById("hindi-btn").addEventListener("click", () => {
  currentSongs = hindiSongs;
  currentSongIndex = 0;
  loadSong(hindiSongs[0]);
  updatePlaylistName('Hindi Songs');
  playlistMenu.classList.remove("active");  // Close the menu
});

document.getElementById("english-btn").addEventListener("click", () => {
  currentSongs = englishSongs;
  currentSongIndex = 0;
  loadSong(englishSongs[0]);
  updatePlaylistName('English Songs');
  playlistMenu.classList.remove("active");  // Close the menu
});

document.getElementById("marathi-btn").addEventListener("click", () => {
  currentSongs = marathiSongs;
  currentSongIndex = 0;
  loadSong(marathiSongs[0]);
  updatePlaylistName('Marathi Songs');
  playlistMenu.classList.remove("active");  // Close the menu
});

document.getElementById("telugu-btn").addEventListener("click", () => {
  currentSongs = teluguSongs;
  currentSongIndex = 0;
  loadSong(teluguSongs[0]);
  updatePlaylistName('Telugu Songs');
  playlistMenu.classList.remove("active");  // Close the menu
});

// Close menu when clicking outside
document.addEventListener("click", (event) => {
  if (!playlistMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    playlistMenu.classList.remove("active");
  }
});

// Update lock screen media information and handle mobile controls
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

betaBtn.addEventListener("click", () => {
  window.location.href = "https://music45beta.vercel.app/index(1).html";
});
