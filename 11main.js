import { hindiSongs, englishSongs, marathiSongs, teluguSongs } from './songs.js';

// Select the container and all genre buttons
const genreContainer = document.querySelector(".genre-grid");
const footerToggleBtn = document.getElementById("footer-song-info");
const songList = document.getElementById("song-list");

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

// Function to handle button click
function showPlaylist(event) {
    const clickedButton = event.currentTarget;
    const buttonId = clickedButton.id;
    const playlist = getPlaylist(buttonId);

    // Replace all buttons with the playlist
    genreContainer.innerHTML = `
        <div class="song-list">
            <ul class="song-list">${playlist}</ul>
            <button class="back-button">🔙 Back</button>
        </div>
    `;

    // Add event listener to Back button
    document.querySelector(".back-button").addEventListener("click", restoreGenres);
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

// Function to generate playlist HTML
function getPlaylist(buttonId) {
    let songs = [];
    if (buttonId === "hindi-btn") songs = hindiSongs;
    else if (buttonId === "english-btn") songs = englishSongs;
    else if (buttonId === "marathi-btn") songs = marathiSongs;
    else if (buttonId === "telugu-btn") songs = teluguSongs;

    return songs.map(song => `<li>${song.title} - ${song.artist}</li>`).join("");
}

// Function to add event listeners to buttons
function addEventListeners() {
    document.querySelectorAll(".genre-card").forEach(button => {
        button.addEventListener("click", showPlaylist);
    });
}

<<<<<<< HEAD

footerToggleBtn.addEventListener("click", () => {
  if (musicBanner.style.display === "block") {
    musicBanner.style.display = "none"; // Close the music banner
    history.pushState(null, null, window.location.href); // Update browser history
  } else {
    musicBanner.style.display = "block"; // Open the music banner
    history.pushState({ musicBannerOpen: true }, null, window.location.href); // Update browser history
=======
  if (trendingCard) {
      trendingCard.addEventListener('click', () => {
          const url = '/index.html'; // Replace with your desired link
          window.open(url,); // Opens in a new tab
      });
>>>>>>> 8ee6dd04b5b46fd2efc3b5cb0bc06ca18d513a18
  }
});


// Initial setup
addEventListeners();
