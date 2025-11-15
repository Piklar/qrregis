// Onload animation using GSAP
window.onload = function () {
  gsap.from([".hero-container", ".cards-container"], {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,
    delay: 0.5
  });
};

