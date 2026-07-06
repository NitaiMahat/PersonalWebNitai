// Orchestrates the intro animation, then reveals the hero.
const intro = document.getElementById("intro");
const hero = document.getElementById("hero");

// How long the intro plays before it slides away (matches the CSS timings).
const INTRO_DURATION = 2300;

function finishIntro() {
  intro.classList.add("is-done");
  hero.classList.add("is-revealed");
}

window.addEventListener("load", () => {
  // If the user prefers reduced motion, skip straight to the hero.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(finishIntro, reduced ? 100 : INTRO_DURATION);
});

// Graceful fallback if the portrait image hasn't been added yet.
const heroImg = document.getElementById("heroImg");
heroImg.addEventListener("error", () => {
  const wrap = heroImg.parentElement;
  heroImg.remove();
  wrap.classList.add("hero__portrait--placeholder");
  wrap.insertAdjacentHTML(
    "beforeend",
    '<div class="hero__portrait-fallback">Add your photo to<br><code>images/hero.jpg</code></div>'
  );
});
