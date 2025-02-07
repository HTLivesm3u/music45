document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const progressBar = document.querySelector('.progress-bar');
  let isPlaying = false;
  let progressInterval;

  // Toggle play/pause
  playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      
      if (isPlaying) {
          playIcon.classList.remove('fa-play');
          playIcon.classList.add('fa-pause');
          startProgress();
      } else {
          playIcon.classList.remove('fa-pause');
          playIcon.classList.add('fa-play');
          stopProgress();
      }
  });

  // Progress bar animation
  function startProgress() {
      let progress = 0;
      progressBar.style.width = '0%';
      
      progressInterval = setInterval(() => {
          progress += 1;
          progressBar.style.width = `${progress}%`;
          
          if (progress >= 100) {
              stopProgress();
              isPlaying = false;
              playIcon.classList.remove('fa-pause');
              playIcon.classList.add('fa-play');
          }
      }, 1000); // Update every second
  }

  function stopProgress() {
      clearInterval(progressInterval);
  }

  // Previous and Next button clicks
  document.getElementById('prevBtn').addEventListener('click', () => {
      progressBar.style.width = '0%';
      stopProgress();
      if (isPlaying) {
          startProgress();
      }
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
      progressBar.style.width = '0%';
      stopProgress();
      if (isPlaying) {
          startProgress();
      }
  });
});