const track = document.querySelector(".slider-track");
const gifts = document.querySelectorAll(".gift-box");
const giftCount = gifts.length;
let currentIndex = 0;

// Page Indicator
const pageIndicator = document.createElement("div");
pageIndicator.id = "page-indicator";
document.body.appendChild(pageIndicator);

function showSlide(index) {
  // Stellt sicher, dass der Index innerhalb der Grenzen bleibt
  currentIndex = Math.max(0, Math.min(index, giftCount - 1));
  
  // Verschiebe den Track um die volle Viewport-Breite (100vw) pro Geschenk
  // Dies stellt sicher, dass immer nur EIN Geschenk zentriert und sichtbar ist,
  // da jede .gift-box 100vw breit ist.
  const offset = -currentIndex * window.innerWidth;
  track.style.transform = `translateX(${offset}px)`;
  
  updatePageIndicator(currentIndex);
}

function updatePageIndicator(index) {
  pageIndicator.textContent = `${index + 1} / ${giftCount}`;
}

// Event Listener für Größenänderung (z.B. bei Drehung des Handys)
window.addEventListener("resize", () => {
    // Ruft showSlide erneut auf, um die Verschiebung an die neue Fensterbreite anzupassen
    showSlide(currentIndex);
});


// Pfeiltasten (Optional, für Desktop-Tests)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") {
    showSlide(currentIndex + 1);
  }
  if (e.key === "ArrowLeft") {
    showSlide(currentIndex - 1);
  }
});

// Touch Swipe fürs Handy
let startX = 0;
let isSwiping = false;

track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    // Optional: Füge hier eine Klasse hinzu, um die Transition temporär zu deaktivieren, 
    // falls du eine Echtzeit-Verschiebung während des Swipens wünschst.
});

track.addEventListener("touchend", e => {
  if (!isSwiping) return;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;
  const swipeThreshold = 50; // Mindestverschiebung für einen Swipe

  if (deltaX < -swipeThreshold) {
    // Swipe nach links -> Nächstes Geschenk
    showSlide(currentIndex + 1);
  } else if (deltaX > swipeThreshold) {
    // Swipe nach rechts -> Vorheriges Geschenk
    showSlide(currentIndex - 1);
  }
  isSwiping = false;
});

// Klick Event
gifts.forEach(gift => {
  gift.addEventListener("click", () => {
    alert("Hier kommt später die Frage oder das Unlock-Game!");
    
    // Beispiel zum Freischalten:
    // gift.querySelector('.gift').classList.add('unlocked'); 
  });
});

// Start Slide
showSlide(currentIndex);