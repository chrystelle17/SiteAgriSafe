/* ==========================================================
   AgriSafe – Interactions
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Retour en haut + logo ---------- */
  const toTop = document.getElementById("toTop");

  function onScroll() {
    toTop.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  // Logo manquant : on garde le rond noir
  document.querySelectorAll(".logo img, .footer-logo img").forEach(img => {
    const hide = () => { img.style.display = "none"; };
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener("error", hide);
  });

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- Carrousel ---------- */
  const carousel = document.getElementById("carousel");
  const carouselArea = carousel.parentElement;
  const slides = carousel.querySelectorAll(".slide");
  const dotsContainer = document.getElementById("carouselDots");
  let current = 0;
  let autoPlay;

  // Création des points de navigation
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Aller à la diapositive " + (i + 1));
    dot.addEventListener("click", () => { goTo(i); restartAuto(); });
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll("button");

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function startAuto() { autoPlay = setInterval(() => goTo(current + 1), 6000); }
  function restartAuto() { clearInterval(autoPlay); startAuto(); }

  document.getElementById("prevBtn").addEventListener("click", () => { goTo(current - 1); restartAuto(); });
  document.getElementById("nextBtn").addEventListener("click", () => { goTo(current + 1); restartAuto(); });

  // Pause au survol
  carouselArea.addEventListener("mouseenter", () => clearInterval(autoPlay));
  carouselArea.addEventListener("mouseleave", startAuto);

  // Navigation clavier
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { goTo(current - 1); restartAuto(); }
    if (e.key === "ArrowRight") { goTo(current + 1); restartAuto(); }
  });

  // Swipe tactile
  let touchStartX = 0;
  carousel.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; });
  carousel.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current - 1 : current + 1); restartAuto(); }
  });

  goTo(0);
  startAuto();

  /* ---------- Effets : ouverture au toucher (mobile) ---------- */
  const effects = document.querySelectorAll(".effect");
  effects.forEach(effect => {
    effect.addEventListener("click", () => {
      const wasOpen = effect.classList.contains("open");
      effects.forEach(e => e.classList.remove("open"));
      if (!wasOpen) effect.classList.add("open");
    });
  });

  /* ---------- Apparition des sections au scroll ---------- */
  const revealTargets = document.querySelectorAll(".section .container");
  revealTargets.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => observer.observe(el));

  /* ---------- Une seule vidéo à la fois ---------- */
  const videos = document.querySelectorAll("video");
  videos.forEach(video => {
    video.addEventListener("play", () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
    });
  });
});
