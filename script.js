const track = document.querySelector(".slider-track");
const gifts = document.querySelectorAll(".gift-box");
const giftCount = gifts.length;
let currentIndex = 0;

// --- INITIALISIERUNG DES SEITENINDIKATORS ---
const pageIndicator = document.createElement("div");
pageIndicator.id = "page-indicator";
document.body.appendChild(pageIndicator);

// --- HELPER FUNKTIONEN ---

function showSlide(index) {
  // Stellt sicher, dass der Index innerhalb der Grenzen bleibt
  currentIndex = Math.max(0, Math.min(index, giftCount - 1));
  
  // Verschiebe den Track um die volle Viewport-Breite (100vw) pro Geschenk
  const offset = -currentIndex * window.innerWidth;
  track.style.transform = `translateX(${offset}px)`;
  
  updatePageIndicator(currentIndex);
}

function updatePageIndicator(index) {
  pageIndicator.textContent = `${index + 1} / ${giftCount}`;
}

// --- QUIZ LOGIK ---

const rudeFeedback = [
    "Falsch! Bist du sicher, dass du mich kennst?",
    "Haha, absolut daneben. Versuch's nochmal, das ist peinlich.",
    "Blink, blink – falsch gedacht. Nächste Chance!",
    "Der Link zu dieser Antwort ist 'Weiß ich nicht'.",
    "Falsch. Frag doch lieber Tante Google, wenn du schon so rätselhaft bist."
];

function handleAnswer(event) {
    const button = event.target;
    const giftBox = button.closest('.gift-box');
    const quizContainer = button.closest('.quiz-container');
    const giftElement = giftBox.querySelector('.gift');
    const feedbackText = giftBox.querySelector('.feedback-text');
    
    // Deaktiviere alle Buttons während der Verarbeitung
    quizContainer.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
    
    // Entferne alte Klassen
    button.classList.remove('incorrect');
    feedbackText.textContent = '';
    
    const selectedAnswer = button.dataset.answer;
    const correctAnswer = quizContainer.dataset.correctAnswer;

    if (selectedAnswer === correctAnswer) {
        // RICHTIGE ANTWORT
        button.classList.add('correct');
        feedbackText.textContent = "Korrekt! Das Geheimnis ist gelüftet!";
        
        // Geschenk freischalten
        giftElement.classList.add('unlocked');
        quizContainer.classList.add('solved');
        
        // Jetzt ist das Bild klickbar für den Link
        giftElement.removeEventListener('click', showQuizIfLocked); // Entferne den alten Klick-Handler
        giftElement.addEventListener('click', navigateToLink);
        
    } else {
        // FALSCHE ANTWORT
        button.classList.add('incorrect');
        const randomFeedback = rudeFeedback[Math.floor(Math.random() * rudeFeedback.length)];
        feedbackText.textContent = randomFeedback;
        
        // Nach der Animation Buttons wieder aktivieren
        setTimeout(() => {
            button.classList.remove('incorrect');
            quizContainer.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = false);
        }, 1500); 
    }
}

function showQuizIfLocked() {
    // Dies ist der Handler, der ausgelöst wird, wenn man auf das GESPERRTE Bild klickt
    const giftElement = this;
    if (!giftElement.classList.contains('unlocked')) {
        const quizContainer = giftElement.parentNode.querySelector('.quiz-container');
        alert("Zuerst musst du die Frage beantworten, um das Geschenk zu sehen!");
        // Optional: Hier könnte man das Quiz in den Fokus rücken oder scrollen
    }
}

function navigateToLink() {
    // Dies ist der Handler, der ausgelöst wird, wenn man auf das FREIGESCHALTETE Bild klickt
    const giftElement = this;
    const link = giftElement.dataset.link;
    if (link) {
        window.open(link, '_blank');
    }
}


// --- EVENT LISTENER ZUWEISUNG ---

// 1. Zuweisung der Quiz-Logik zu den Buttons
document.querySelectorAll('.answer-btn').forEach(button => {
    button.addEventListener('click', handleAnswer);
});

// 2. Klick auf gesperrtes Bild soll den Benutzer informieren
document.querySelectorAll('.gift').forEach(gift => {
    gift.addEventListener('click', showQuizIfLocked);
});


// 3. Swipe und Resize Logik (wie zuvor)
window.addEventListener("resize", () => {
    showSlide(currentIndex);
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") {
    showSlide(currentIndex + 1);
  }
  if (e.key === "ArrowLeft") {
    showSlide(currentIndex - 1);
  }
});

let startX = 0;
let isSwiping = false;

track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isSwiping = true;
});

track.addEventListener("touchend", e => {
  if (!isSwiping) return;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;
  const swipeThreshold = 50; 

  if (deltaX < -swipeThreshold) {
    showSlide(currentIndex + 1);
  } else if (deltaX > swipeThreshold) {
    showSlide(currentIndex - 1);
  }
  isSwiping = false;
});

// Start Slide
showSlide(currentIndex);