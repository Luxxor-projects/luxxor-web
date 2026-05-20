gsap.registerPlugin(ScrollTrigger);
const video = document.getElementById("heroVideo");
const loader = document.getElementById("loader");
const title = document.getElementById("heroTitle");
const overlay = document.getElementById("overlay");
const scrollInd = document.getElementById("scrollInd");
const archText = document.getElementById("archText");
let isReady = false;
video.addEventListener("loadedmetadata", () => {
  isReady = true;
  video.pause();
  video.currentTime = 0;
  loader.style.opacity = "0";
  setTimeout(() => loader.style.display = "none", 800);
  setupScroll();
}, { once: true });
setTimeout(() => {
  if (!isReady) {
    isReady = true;
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 800);
    setupScroll();
  }
}, 8000);
function setupScroll() {
  const wrapper = document.getElementById("heroWrapper");
  const duration = video.duration || 5;
  window.addEventListener("scroll", () => {
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = wrapper.offsetTop;
    const wrapperHeight = wrapper.offsetHeight;
    const windowHeight = window.innerHeight;
    let scrolled = window.scrollY - wrapperTop;
    scrolled = Math.max(0, scrolled);
    const maxScroll = wrapperHeight - windowHeight;
    const progress = maxScroll > 0 ? scrolled / maxScroll : 0;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    video.currentTime = clampedProgress * duration;
    updateUI(clampedProgress);
  }, { passive: true });
  updateUI(0);
}
function updateUI(p) {
  if (p < 0.12) {
    title.style.opacity = 1 - (p / 0.12);
    title.style.transform = `translateX(-50%) translateY(${p * -40 / 0.12}px)`;
  } else {
    title.style.opacity = "0";
  }
  scrollInd.style.opacity = p < 0.08 ? 1 - (p / 0.08) : "0";
  if (p > 0.1 && p < 0.85) {
    const show = Math.min((p - 0.1) / 0.1, 1);
    document.querySelectorAll(".corner").forEach(c => c.style.opacity = show);
    archText.style.opacity = show;
  } else if (p <= 0.1) {
    document.querySelectorAll(".corner").forEach(c => c.style.opacity = "0");
    archText.style.opacity = "0";
  } else {
    const hide = 1 - Math.min((p - 0.85) / 0.1, 1);
    document.querySelectorAll(".corner").forEach(c => c.style.opacity = hide);
    archText.style.opacity = hide;
  }
  setPin("pin1", p, 0.08, 0.18, 0.24, 0.34);
  setPin("pin2", p, 0.35, 0.45, 0.52, 0.62);
  setPin("pin3", p, 0.20, 0.30, 0.36, 0.46);
  setPin("pin4", p, 0.55, 0.65, 0.72, 0.82);
  if (p > 0.82) {
    const t = Math.min((p - 0.82) / 0.18, 1);
    overlay.style.background = `rgba(0,0,0,${t * 0.94})`;
  } else {
    overlay.style.background = "rgba(0,0,0,0)";
  }
  const logo = document.querySelector(".logo");
  logo.style.transform = `scale(${Math.max(0.82, 1 - p * 0.18)})`;
  logo.style.opacity = Math.max(0.65, 1 - p * 0.35);
}
function setPin(id, p, fadeIn, sustain, fadeOut, end) {
  const el = document.getElementById(id);
  let op = 0, ty = 20;
  if (p >= fadeIn && p < sustain) {
    op = (p - fadeIn) / (sustain - fadeIn);
    ty = 20 * (1 - op);
  } else if (p >= sustain && p < fadeOut) {
    op = 1;
    ty = 0;
  } else if (p >= fadeOut && p < end) {
    op = 1 - (p - fadeOut) / (end - fadeOut);
    ty = -20 * (1 - op);
  }
  el.style.opacity = op;
  el.style.transform = `translateY(${ty}px)`;
}
gsap.from(".about-content", {
  opacity: 0, y: 80, duration: 1.6, ease: "power3.out",
  scrollTrigger: { trigger: ".about", start: "top 75%" }
});
gsap.from(".feature-item", {
  opacity: 0, y: 50, duration: 1.2, ease: "power2.out", stagger: 0.22,
  scrollTrigger: { trigger: ".features", start: "top 80%" }
});
