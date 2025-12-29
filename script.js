// ===== Helpers
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

// Year
$("#year").textContent = new Date().getFullYear();

// ===== Animated navbar blur on scroll
const navbar = $("#navbar");
const navInner = $("#navInner");

function onScrollNav() {
  const scrolled = window.scrollY > 10;
  navbar.classList.toggle("py-2", scrolled);
  navbar.classList.toggle("py-0", scrolled);

  // Extra blur + darker tint on scroll
  navInner.style.background = scrolled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.05)";
  navInner.style.borderColor = scrolled ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.10)";
}
window.addEventListener("scroll", onScrollNav);
onScrollNav();

// ===== Mobile menu
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu on link click
$$('#mobileMenu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// ===== Scroll reveal (IntersectionObserver)
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ===== Swiper: Projects
let projSwiper = new Swiper("#projectsSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: false,
  pagination: { el: "#projDots", clickable: true },
  navigation: { nextEl: "#projNext", prevEl: "#projPrev" },
  breakpoints: {
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 2 }
  }
});

// ===== Projects filter
const filterBtns = $$(".filter-btn");
function applyProjectFilter(filter) {
  filterBtns.forEach(b => b.classList.toggle("active", b.dataset.filter === filter));

  const slides = $$(".project-slide");
  slides.forEach(slide => {
    const show = filter === "all" || slide.dataset.category === filter;
    slide.style.display = show ? "" : "none";
  });

  // Swiper needs update after DOM changes
  projSwiper.update();
}
filterBtns.forEach(btn => btn.addEventListener("click", () => applyProjectFilter(btn.dataset.filter)));

// ===== Swiper: Testimonials
new Swiper("#testSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: false,
  pagination: { el: "#testDots", clickable: true },
  navigation: { nextEl: "#testNext", prevEl: "#testPrev" }
});

// ===== Contact form validation (frontend only)
const form = $("#contactForm");
const alertBox = $("#alert");
const submitBtn = $("#submitBtn");

function showAlert(type, msg) {
  alertBox.classList.remove("hidden");
  alertBox.textContent = msg;
  alertBox.style.borderColor = type === "success" ? "rgba(16,185,129,0.35)" : "rgba(248,113,113,0.35)";
  alertBox.style.background = type === "success" ? "rgba(16,185,129,0.10)" : "rgba(248,113,113,0.10)";
  alertBox.style.color = "rgba(255,255,255,0.92)";
}

function setErr(id, isBad) {
  const input = $("#" + id);
  const err = input.parentElement.querySelector(".err");
  if (isBad) err.classList.remove("hidden");
  else err.classList.add("hidden");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  const badName = name.length < 2;
  const badEmail = !isValidEmail(email);
  const badMsg = message.length < 10;

  setErr("name", badName);
  setErr("email", badEmail);
  setErr("message", badMsg);

  if (badName || badEmail || badMsg) {
    showAlert("error", "Please fix the highlighted fields and try again.");
    return;
  }

  // Demo success (no backend yet)
  submitBtn.classList.add("loading");
  submitBtn.querySelector("span").textContent = "Sending...";

  await new Promise(r => setTimeout(r, 900));

  submitBtn.classList.remove("loading");
  submitBtn.querySelector("span").textContent = "Send Message";

  form.reset();
  showAlert("success", "Message sent successfully! (Demo) Connect Formspree later for real submissions.");
});


