const track = document.querySelector(".slider-track");
const gifts = document.querySelectorAll(".gift-box");
let currentIndex = 0;

// Page Indicator
const pageIndicator = document.createElement("div");
pageIndicator.id = "page-indicator";
document.body.appendChild(pageIndicator);

function showSlide(index) {
  const offset = -index * window.innerWidth; // Snap pro Bildschirmbreite
  track.style.transform = `translateX(${offset}px)`;
  updatePageIndicator(index);
}

function updatePageIndicator(index) {
  pageIndicator.textContent = `${index + 1} / ${gifts.length}`;
}

// Pfeiltasten
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") currentIndex = Math.min(currentIndex + 1, gifts.length - 1);
  if (e.key === "ArrowLeft") currentIndex = Math.max(currentIndex - 1, 0);
  showSlide(currentIndex);
});

// Touch Swipe fürs Handy
let startX = 0;
track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
track.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (endX < startX - 30) currentIndex = Math.min(currentIndex + 1, gifts.length - 1);
  else if (endX > startX + 30) currentIndex = Math.max(currentIndex - 1, 0);
  showSlide(currentIndex);
});

// Klick Event (Unlock / Frage)
gifts.forEach(gift => {
  gift.addEventListener("click", () => {
    alert("Hier kommt später die Frage oder das Unlock-Game!");
  });
});

// Start Slide
showSlide(currentIndex);
