var countries = ["himesh","khelge"]




// Song playlist data
const playlist = [
{
    title: "ekati ekati ghabarlis na",
    artist: "Anjali Kulkarni",
    src: "music/song1.mp3",
    cover: "https://c.saavncdn.com/993/Aai-Aaj-Khup-Kahi-Sangaychay-Marathi-2022-20220709110626-500x500.jpg",
  },
  {
    title: "AAI",
    artist: "Yogita Koli,Pravin Koli",
    src: "music/song2.mp3",
    cover: "https://c.saavncdn.com/621/Aai-Marathi-2022-20220505134712-500x500.jpg",
  },
  {
    title: "Song Title 3",
    artist: "Artist Name 3",
    src: "music/song3.mp3",
    cover: "music/song33.jpg",
  },
];

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

let currentSongIndex = 0; // Start with the first song
let isPlaying = false;

// Load a song into the player
function loadSong(song) {
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImage.src = song.cover;
}

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

// Play the next song manually
nextBtn.addEventListener("click", () => {
  playNextSong();
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

// Automatically play the next song when the current one ends
audio.addEventListener("ended", () => {
  playNextSong();
});

// Play the next song function
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length; // Loop back to the first song
  loadSong(playlist[currentSongIndex]);
  if (isPlaying) {
    audio.play(); // Automatically play the next song if already playing
  } else {
    playPauseBtn.textContent = "▶️"; // Ensure play icon is updated
  }
}

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

// Load the first song on page load
loadSong(playlist[currentSongIndex]);
