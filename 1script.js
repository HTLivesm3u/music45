// JavaScript for handling audio controls
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
let isPlaying = false;

// Toggle play/pause
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️"; // Change icon to play
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸️"; // Change icon to pause
  }
  isPlaying = !isPlaying;
});

// You can add functionality for "prev" and "next" buttons later
