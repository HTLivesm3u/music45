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


// Function to handle button click
function showPlaylist(event) {
  const clickedButton = event.currentTarget;
  const buttonId = clickedButton.id;
  const playlist = getPlaylist(buttonId);

  // Push new history state
  history.pushState({ page: "playlist" }, "", "#playlist");

  // Replace all buttons with the playlist
  genreContainer.innerHTML = `
      <div class="song-list">
          <ul class="song-list">${playlist}</ul>
      </div>
  `;

  // Add event listener to Back button
  document.querySelector(".back-button").addEventListener("click", restoreGenres);
}

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.page === "playlist") {
      restoreGenres(); // Restore genre selection
  }
});


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

  const songList = document.createElement("ul");
  songList.classList.add("song-list");

  songs.forEach(song => {
      const li = document.createElement("li");
      li.classList.add("song-item");
      li.setAttribute("data-src", song.src);

      // Create Cover Image
      const coverImg = document.createElement("img");
      coverImg.src = song.cover;
      coverImg.alt = song.title + " Cover";
      coverImg.classList.add("song-cover");

      // Create Title and Artist Text
      const songText = document.createElement("span");
      songText.textContent = `${song.title} - ${song.artist}`;

      // Create Hidden Play Icon
      const playIcon = document.createElement("img");
      playIcon.src = "play-icon.png";
      playIcon.alt = "Play Icon";
      playIcon.classList.add("now-playing-icon");
      playIcon.style.display = "none"; // Hide initially

      // Append elements
      li.appendChild(coverImg);
      li.appendChild(songText);
      li.appendChild(playIcon);

      songList.appendChild(li);
  });

  return songList.outerHTML;
}


// Function to add event listeners to buttons
function addEventListeners() {
    document.querySelectorAll(".genre-card").forEach(button => {
        button.addEventListener("click", showPlaylist);
    });
}

// Initial setup
addEventListeners();
