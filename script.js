import { songs } from './songs.js';

// Song playlist data
const playlist = songs 

// Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const coverImage = document.getElementById("cover-image");
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const suggestionsList = document.getElementById("suggestions-list");

let currentSongIndex = 0; // Start with the first song
let isPlaying = false;

// Load a song into the player
function loadSong(song) {
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
}
// Elements for progress bar and timer
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// Update progress bar and time
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  // Update current time and duration
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

// Search for a song and show suggestions
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase().trim();
  suggestionsList.innerHTML = ""; // Clear previous suggestions

  if (query) {
    // Find matching songs
    const matches = playlist.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );

    // Display suggestions
    matches.forEach((song) => {
      const suggestionItem = document.createElement("li");
      suggestionItem.textContent = `${song.title} - ${song.artist}`;
      suggestionItem.addEventListener("click", () => {
        // Load the selected song
        const index = playlist.findIndex(
          (s) => s.title === song.title && s.artist === song.artist
        );
        currentSongIndex = index;
        loadSong(song);
        if (isPlaying) {
          audio.play(); // Play immediately if already playing
        }
        searchBar.value = ""; // Clear search bar
        suggestionsList.innerHTML = ""; // Clear suggestions
      });
      suggestionsList.appendChild(suggestionItem);
    });
  }
});

// Search Button Click
searchBtn.addEventListener("click", () => {
  const query = searchBar.value.toLowerCase().trim();
  if (!query) return;

  const songIndex = playlist.findIndex(
    (song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
  );

  if (songIndex !== -1) {
    currentSongIndex = songIndex;
    loadSong(playlist[currentSongIndex]);
    if (isPlaying) {
      audio.play();
    }
  } else {
    alert("No matching song found!");
  }

  searchBar.value = ""; // Clear search bar
  suggestionsList.innerHTML = ""; // Clear suggestions
});

// Format time (mm:ss)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Seek functionality (click on the progress bar)
progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  // Set the audio's current time
  audio.currentTime = (clickX / width) * duration;
});

// Play or pause the song
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️"; // Change to play icon
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸️"; // Change to pause icon
  }
  isPlaying = !isPlaying;
});

// Play the next song
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length; // Loop back to the first song
  loadSong(playlist[currentSongIndex]);
  if (isPlaying) {
    audio.play(); // Automatically play the next song if already playing
  }
});

// Play the previous song
prevBtn.addEventListener("click", () => {
  currentSongIndex =
    (currentSongIndex - 1 + playlist.length) % playlist.length; // Loop to the last song
  loadSong(playlist[currentSongIndex]);
  if (isPlaying) {
    audio.play(); // Automatically play the previous song if already playing
  }
});


// Play the next song automatically
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length; // Loop back to the first song if at the end
  loadSong(playlist[currentSongIndex]); // Load the new song

  // Play the song immediately
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = '⏸️'; // Update button to pause icon
}

// Automatically play the next song when the current one ends
audio.addEventListener("ended", () => {
  playNextSong();
});

// Search for a song or artist
searchBtn.addEventListener("click", () => {
  const query = searchBar.value.toLowerCase().trim(); // Get the search query
  const songIndex = playlist.findIndex(
    (song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
  );

  if (songIndex !== -1) {
    currentSongIndex = songIndex; // Update the current song index
    loadSong(playlist[currentSongIndex]);
    if (isPlaying) {
      audio.play(); // Automatically play the searched song if already playing
    }
  } else {
    alert("No matching song found!");
  }
});

let isShuffle = false;

// Toggle Shuffle Mode
document.getElementById("shuffle-btn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle-btn").classList.toggle("active", isShuffle);
  if (isShuffle) {
    playlist = shuffleArray(playlist);
  } else {
    playlist = resetPlaylistOrder(); // Restore original playlist order
  }
});

// Shuffle helper function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function resetPlaylistOrder() {
  return [
    // Reset with the original order of the playlist
       playlist
  ];
}
let isRepeat = false;

// Toggle Repeat Mode
document.getElementById("repeat-btn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat-btn").classList.toggle("active", isRepeat);

  if (isRepeat) {
    audio.loop = true; // Loop the current song
  } else {
    audio.loop = false; // Disable looping
  }
});

// When a song ends, check for repeat behavior
audio.addEventListener("ended", () => {
  if (isRepeat) {
    // If repeat mode is on, play the same song again
    audio.play();
  } else if (!isShuffle) {
    playNextSong(); // Move to next song if shuffle is off
  }
});
let likedSongs = new Set();

// Toggle Like
document.getElementById("like-btn").addEventListener("click", () => {
  const currentSong = playlist[currentSongIndex];
  if (likedSongs.has(currentSong.title)) {
    likedSongs.delete(currentSong.title);
    document.getElementById("like-btn").textContent = "❤️"; // Unmark as liked
  } else {
    likedSongs.add(currentSong.title);
    document.getElementById("like-btn").textContent = "💖"; // Mark as liked
  }
});

// Example: Displaying liked songs (could be added as a feature)
function displayLikedSongs() {
  console.log("Liked Songs:", Array.from(likedSongs).join(", "));
}



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
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      currentSongIndex =
        (currentSongIndex - 1 + playlist.length) % playlist.length;
      loadSong(playlist[currentSongIndex]);
      if (isPlaying) audio.play();
    });
  }
}

// Update lock screen metadata when a new song loads
function loadSong(song) {
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
  updateMediaSession(song); // Update lock screen metadata
}

// Load the first song on page load
loadSong(playlist[currentSongIndex]);
