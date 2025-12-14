const gifts = document.querySelectorAll(".gift");

gifts.forEach(gift => {
  gift.addEventListener("click", () => {
    alert("Hier kommt später die Frage oder das Unlock-Game!");
  });
});
