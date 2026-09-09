const slider = document.getElementById("compareSlider");
const after = document.getElementById("afterLayer");
const line = document.getElementById("compareLine");

function updateCompare() {
  const value = slider.value;
  after.style.width = value + "%";
  line.style.left = value + "%";
}

slider.addEventListener("input", updateCompare);
updateCompare();

document.getElementById("year").textContent = new Date().getFullYear();
