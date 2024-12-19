// Song playlist data
const playlist = [
{
    title: "ekati ekati ghabarlis na",
    artist: "Anjali Kulkarni",
    src: "music/song1.mp3",
    cover: "https://imgs.search.brave.com/HVqjF7CWQpUU0UGZZaMtr67XIyOoIGuUrRJuGBv8z8I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1QllUaGlaV015/WmpRdFlUQXhaUzAw/TkdNMkxUZ3hOREF0/Tnpnd05HRmhOakUx/WkRJNVhrRXlYa0Zx/Y0djQC5qcGc",
  },
  {
    title: "AAI",
    artist: "Yogita Koli,Pravin Koli",
    src: "music/song2.mp3",
    cover: "https://c.saavncdn.com/621/Aai-Marathi-2022-20220505134712-500x500.jpg",
  },
  {
    title: "govyachya kinaryavar",
    artist: "pravin koli",
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


// Elements
// const progressBar = document.getElementById("progress-bar");
// const audio = document.getElementById("audio");

// Update the progress bar as the audio plays
// audio.addEventListener("timeupdate", () => {
//   const progressPercent = (audio.currentTime / audio.duration) * 100;
//   progressBar.style.width = `${progressPercent}%`;
// });

// Seek functionality (click to change position)
// document.querySelector(".progress-container").addEventListener("click", (event) => {
//   const containerWidth = event.currentTarget.offsetWidth;
//   const clickX = event.offsetX;
//   const newTime = (clickX / containerWidth) * audio.duration;
//   audio.currentTime = newTime;
// });
