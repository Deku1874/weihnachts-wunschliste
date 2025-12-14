const track = document.querySelector(".slider-track");
const gifts = document.querySelectorAll(".gift-box");
const giftCount = gifts.length;
let currentIndex = 0;

const quizModal = document.getElementById("quizModal");
const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");
const feedbackText = document.getElementById("feedbackText");

const quizData = [
  {
    question: "Wann habe ich Geburtstag?",
    correct: "14.02.2006",
    wrong: ["25.12.1999", "01.04.2005", "31.10.2007"],
    link: "https://www.zalando.de/nike-sportswear-air-force-1-07-sneaker-low-white-ni112n022-a11.html",
    wrongTexts: ["Nope, so alt bin ich nicht! 😅", "Falsch! Ich bin kein Aprilscherz! 🤡", "Halloween? Versuch's nochmal! 🎃"]
  },
  {
    question: "Was studiere ich?",
    correct: "Interaktive Medien",
    wrong: ["Raketenwissenschaft", "Unterwasser-Korbflechten", "Meme-ologie"],
    link: "https://www.zalando.de/karl-kani-jeans-relaxed-fit-grey-kk122g04f-c11.html",
    wrongTexts: ["Klingt cool, aber nein! 🚀", "Kreativ, aber leider falsch! 🧺", "Fast, aber nicht ganz! 😂"]
  },
  {
    question: "Wie groß bin ich?",
    correct: "Größer als Papa",
    wrong: ["Kleiner als ein Gartenzwerg", "Genau 2 Meter", "Durchschnittlich"],
    link: "https://www.zalando.de/karl-kani-tribal-baggy-five-pocket-jeans-relaxed-fit-bleached-blue-kk122g03r-k11.html",
    wrongTexts: ["Haha, so klein bin ich nicht! 🧙", "Übertreib mal nicht! 🏀", "Nope, ich bin größer! 📏"]
  },
  {
    question: "Wer ist mein Lieblings Musiker?",
    correct: "T-low",
    wrong: ["Helene Fischer", "Mozart", "Die Schlümpfe"],
    link: "https://shirtz.cool/products/the-weaver-hoodie?variant=41144949211234",
    wrongTexts: ["Atemlos? Eher nicht! 🎤", "Zu klassisch für mich! 🎻", "La la la... NEIN! 💙"]
  },
  {
    question: "Was ist mein Lieblings Getränk?",
    correct: "White Monster",
    wrong: ["Warme Milch mit Honig", "Gurkenwasser", "Red Bull"],
    link: "https://shirtz.cool/products/the-demon-hoodie",
    wrongTexts: ["Klingt nach Einschlafhilfe! 🥛", "Bäh! Versuch's nochmal! 🥒", "Falsche Farbe, falscher Drink! 🔴"]
  },
  {
    question: "Was ist mein Lieblings Story Spiel?",
    correct: "Resident Evil",
    wrong: ["Candy Crush", "Die Sims", "Minesweeper"],
    link: "https://store.steampowered.com/app/3764200/Resident_Evil_Requiem/",
    wrongTexts: ["Zu süß für mich! 🍬", "Nicht gruselig genug! 🏠", "Zu explosiv... warte, was? 💣"]
  },
  {
    question: "Wo will ich gerne hinreisen?",
    correct: "Japan",
    wrong: ["Bielefeld", "Atlantis", "Zur Sonne"],
    link: "https://www.amazon.de/Elgato-Studio-Controller-ausl%C3%B6sen-Software-20GBA9901-wt/dp/B09RMXK59C/",
    wrongTexts: ["Das gibt's doch gar nicht! 🤔", "Zu nass für mich! 🌊", "Zu heiß! Ich mag Sushi mehr! 🍣"]
  }
];

const unlockedGifts = new Array(giftCount).fill(false);

// Page Indicator
const pageIndicator = document.createElement("div");
pageIndicator.id = "page-indicator";
document.body.appendChild(pageIndicator);

function showSlide(index) {
  currentIndex = Math.max(0, Math.min(index, giftCount - 1));
  const offset = -currentIndex * window.innerWidth;
  track.style.transform = `translateX(${offset}px)`;
  updatePageIndicator(currentIndex);
}

function updatePageIndicator(index) {
  pageIndicator.textContent = `${index + 1} / ${giftCount}`;
}

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

function showQuiz(giftIndex) {
  const quiz = quizData[giftIndex];
  quizQuestion.textContent = quiz.question;
  feedbackText.textContent = "";
  
  const allAn