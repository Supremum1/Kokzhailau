const BOOKING_URL = "https://api.whatsapp.com/send/?phone=77783571119&text&type=phone_number&app_absent=0&utm_source=ig";

document.querySelectorAll(".booking-link").forEach((link) => {
  link.href = BOOKING_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px" },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-film-reel]").forEach((reel) => {
  const track = reel.querySelector(".film-track");
  const group = reel.querySelector(".film-group");
  const clone = group.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  clone.querySelectorAll("img").forEach((image) => {
    image.alt = "";
  });
  track.append(clone);

  const updateDistance = () => {
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    track.style.setProperty("--film-distance", `${group.getBoundingClientRect().width + gap}px`);
  };

  updateDistance();
  window.addEventListener("load", updateDistance, { once: true });
  new ResizeObserver(updateDistance).observe(group);
});

const galleries = {
  house: [
    ["дом.webp", "Дом и окрестности"],
    ["дом2.webp", "Окрестности дома"],
    ["дом3.webp", "Kokzhailau Ecowood House"],
  ],
};

document.querySelectorAll(".room-row").forEach((row, rowIndex) => {
  const title = row.querySelector("h3")?.textContent.trim().replace(/\s+/g, " ") || "Внутри";
  const key = `room-${rowIndex}`;
  const images = [...row.querySelectorAll(".row-scroll img")];
  galleries[key] = images.map((image) => [image.getAttribute("src"), title]);
  images.forEach((image, imageIndex) => {
    image.dataset.gallery = key;
    image.dataset.index = imageIndex;
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Открыть фото: ${title}`);
  });
});

const bathImages = [...document.querySelectorAll(".bath-gallery img")];
if (bathImages.length) {
  galleries.bath = bathImages.map((image) => [image.getAttribute("src"), ""]);
  bathImages.forEach((image, imageIndex) => {
    image.dataset.gallery = "bath";
    image.dataset.index = imageIndex;
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", "Открыть фото бани");
  });
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
let currentGallery = "house";
let currentIndex = 0;

function showLightboxImage() {
  const [source, caption] = galleries[currentGallery][currentIndex];
  lightboxImage.src = source;
  lightboxImage.alt = caption || "Фото";
  lightboxCaption.hidden = !caption;
  lightboxCaption.textContent = caption
    ? `${caption} · ${currentIndex + 1} / ${galleries[currentGallery].length}`
    : "";
}

document.querySelectorAll("[data-gallery]").forEach((button) => {
  const open = () => {
    currentGallery = button.dataset.gallery;
    currentIndex = Number(button.dataset.index);
    if (!galleries[currentGallery]?.length) return;
    showLightboxImage();
    lightbox.showModal();
    document.body.classList.add("lightbox-open");
  };
  button.addEventListener("click", open);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

function moveLightbox(direction) {
  const length = galleries[currentGallery].length;
  currentIndex = (currentIndex + direction + length) % length;
  showLightboxImage();
}

if (lightbox) {
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => moveLightbox(-1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => moveLightbox(1));
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("close", () => document.body.classList.remove("lightbox-open"));
}

document.addEventListener("keydown", (event) => {
  if (!lightbox?.open) return;
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
