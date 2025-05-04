// script.js

// Scroll animations using IntersectionObserver
const faders = document.querySelectorAll('.feature, .member');

const appearOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("appear");
      appearOnScroll.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Mobile nav toggle (for future enhancement)
// const navToggle = document.querySelector('.nav-toggle');
// const navLinks = document.querySelector('.nav-links');
// navToggle.addEventListener('click', () => {
//   navLinks.classList.toggle('nav-open');
// });