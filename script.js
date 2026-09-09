const year = document.getElementById("year");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
const lightboxNext = lightbox?.querySelector(".lightbox-next");
const loadedSamples = [];
let currentSampleIndex = -1;
const sampleMenuToggle = document.querySelector(".sample-menu-toggle");
const sampleOptions = document.getElementById("sample-options");
const sampleOptionButtons = document.querySelectorAll(".sample-option");
const portfolioTitle = document.getElementById("portfolio-title");

if (year) {
  year.textContent = new Date().getFullYear();
}

function showSample(index) {
  if (!lightbox || !lightboxImage || typeof lightbox.showModal !== "function") {
    return;
  }

  const sample = loadedSamples[index];

  if (!sample) {
    return;
  }

  currentSampleIndex = index;
  lightboxImage.src = sample.src;
  lightboxImage.alt = sample.alt;

  if (!lightbox.open) {
    lightbox.showModal();
  }
}

function showNextSample(direction) {
  const availableIndexes = loadedSamples
    .map((sample, index) => (sample && !sample.element.hidden ? index : -1))
    .filter((index) => index >= 0);

  if (!availableIndexes.length) {
    return;
  }

  const currentPosition = availableIndexes.indexOf(currentSampleIndex);
  const fallbackPosition = direction > 0 ? -1 : 0;
  const nextPosition =
    (currentPosition >= 0 ? currentPosition : fallbackPosition) + direction;
  const wrappedPosition =
    (nextPosition + availableIndexes.length) % availableIndexes.length;

  showSample(availableIndexes[wrappedPosition]);
}

document.querySelectorAll(".sample").forEach((sample, index) => {
  const src = sample.dataset.file;
  const alt = sample.dataset.alt || "Portfolio sample";

  if (!src) {
    return;
  }

  const link = document.createElement("a");
  const image = document.createElement("img");

  link.href = src;
  link.setAttribute("aria-label", `Open ${alt.toLowerCase()} full size`);

  image.alt = alt;
  image.decoding = "async";

  if (index > 0) {
    image.loading = "lazy";
  }

  image.addEventListener("load", () => {
    sample.classList.add("is-loaded");
    loadedSamples[index] = { src: link.href, alt, element: sample };
  });

  image.addEventListener("error", () => {
    sample.classList.add("is-missing");
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
  });

  link.addEventListener("click", (event) => {
    if (
      sample.classList.contains("is-missing") ||
      !lightbox ||
      !lightboxImage ||
      typeof lightbox.showModal !== "function"
    ) {
      return;
    }

    event.preventDefault();
    showSample(index);
  });

  link.append(image);
  sample.append(link);
  image.src = src;
});

function setSampleFilter(filter) {
  document.querySelectorAll(".sample").forEach((sample) => {
    sample.hidden = sample.dataset.kind !== filter;
  });

  sampleOptionButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
  });

  if (portfolioTitle) {
    portfolioTitle.textContent = filter === "manhwa" ? "Manhwa" : "Manga";
  }
}

sampleMenuToggle?.addEventListener("click", () => {
  const isOpen = sampleMenuToggle.getAttribute("aria-expanded") === "true";

  sampleMenuToggle.setAttribute("aria-expanded", String(!isOpen));

  if (sampleOptions) {
    sampleOptions.hidden = isOpen;
  }
});

sampleOptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setSampleFilter(button.dataset.filter || "manga");

    if (sampleOptions && sampleMenuToggle) {
      sampleOptions.hidden = true;
      sampleMenuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

lightboxClose?.addEventListener("click", () => {
  lightbox?.close();
});

lightboxPrev?.addEventListener("click", (event) => {
  event.stopPropagation();
  showNextSample(-1);
});

lightboxNext?.addEventListener("click", (event) => {
  event.stopPropagation();
  showNextSample(1);
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showNextSample(-1);
  }

  if (event.key === "ArrowRight") {
    showNextSample(1);
  }
});
