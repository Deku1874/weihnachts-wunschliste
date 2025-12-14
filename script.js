const track = document.querySelector(".slider-track");
const gifts = document.querySelectorAll(".gift-box");
let currentIndex = 0;

// Page Indicator
const pageIndicator = document.createElement("div");
pageIndicator.id = "page-indicator";
document.body.appendChild(pageIndicator);

function showSlide(index) {
  // Berechne Offset so, dass die Box immer zentriert ist
  const giftWidth = gifts[0].offsetWidth;
  const offset = -index * window.innerWidth + (window.innerWidth - giftWidth) / 2;
  track.style.transform = `translateX(${offset}px)`;
  updatePageIndicator(index);
}

function updatePageIndicator(index) {
  pageIndicator.textContent = `${index + 1} / ${gifts.length}`;
}

// Pfeiltasten
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" && currentIndex < gifts.length - 1) {
    currentIndex++;
    showSlide(currentIndex);
  }
  if (e.key === "ArrowLeft" && currentIndex > 0) {
    currentIndex--;
    showSlide(currentIndex);
  }
});

// Touch Swipe fürs Handy
let startX = 0;
track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
track.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (endX < startX - 50 && currentIndex < gifts.length - 1) {
    currentIndex++;
    showSlide(currentIndex);
  } else if (endX > startX + 50 && currentIndex > 0) {
    currentIndex--;
    showSlide(currentIndex);
  }
});

// Klick Event
gifts.forEach(gift => {
  gift.addEventListener("click", () => {
    alert("Hier kommt später die Frage oder das Unlock-Game!");
  });
});

// Start Slide
showSlide(currentIndex);
