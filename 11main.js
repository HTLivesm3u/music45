// Add smooth scrolling for the playlist cards
document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.scroll-container');
  let isDown = false;
  let startX;
  let scrollLeft;

  scrollContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      scrollContainer.style.cursor = 'grabbing';
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('mouseleave', () => {
      isDown = false;
      scrollContainer.style.cursor = 'grab';
  });

  scrollContainer.addEventListener('mouseup', () => {
      isDown = false;
      scrollContainer.style.cursor = 'grab';
  });

  scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
  });

  // Add hover effect for playlist cards
  const playlistCards = document.querySelectorAll('.playlist-card');
  playlistCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
          const playButton = card.querySelector('.play-button');
          playButton.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
          const playButton = card.querySelector('.play-button');
          playButton.style.opacity = '0';
      });
  });

  // Add click handlers for control buttons
  const playButtons = document.querySelectorAll('.play-button, .play-button-large, .control-button');
  playButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Add your music playback logic here
          console.log('Button clicked');
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Select the "Trending" genre card (gradient-1)
  const trendingCard = document.querySelector('.genre-card.gradient-1');

  if (trendingCard) {
      trendingCard.addEventListener('click', () => {
          const url = '/index.html'; // Replace with your desired link
          window.open(url, '_blank'); // Opens in a new tab
      });
  }
});

