const checkboxes = document.querySelectorAll("input[type='checkbox']");

// Lade gespeicherten Zustand
checkboxes.forEach((box, index) => {
  const saved = localStorage.getItem("wish_" + index);
  if (saved === "true") box.checked = true;

  box.addEventListener("change", () => {
    localStorage.setItem("wish_" + index, box.checked);
  });
});
