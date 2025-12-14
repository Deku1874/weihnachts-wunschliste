const track = document.querySelector(".slider-track");
const gifts = document.querySelectorAll(".gift-box");
let currentIndex = 0;

function showSlide(index) {
  const offset = -index * gifts[0].offsetWidth;
  track.style.transform = `translateX(${offset}px)`;
}

// Arrow keys
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") currentIndex = (currentIndex + 1) % gifts.length;
  if (e.key === "ArrowLeft") currentIndex = (currentIndex - 1 + gifts.length) % gifts.length;
  showSlide(currentIndex);
});

// Touch swipe für mobile
let startX = 0;
track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
track.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (endX < startX - 30) currentIndex = (currentIndex + 1) % gifts.length;
  else if (endX > startX + 30) currentIndex = (currentIndex - 1 + gifts.length) % gifts.length;
  showSlide(currentIndex);
});

// Klick Event (platzhalter)
gifts.forEach(gift => {
  gift.addEventListener("click", () => {
    alert("Hier kommt später die Frage oder das Unlock-Game!");
  });
});
