function setupFeaturedFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".featured-post-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((node) => node.classList.toggle("active", node === button));

      cards.forEach((card) => {
        const visible = filter === "all" || card.dataset.category === filter;
        card.hidden = !visible;
      });
    });
  });
}

function setupBrandCarousel() {
  const carousel = document.querySelector("[data-brand-carousel]");
  if (!carousel) return;

  const firstSet = carousel.querySelector(".brand-logo-set");
  if (!firstSet) return;

  const updateMetrics = () => {
    carousel.style.setProperty("--brand-carousel-width", `${carousel.clientWidth}px`);
    carousel.style.setProperty("--brand-slide-distance", `${firstSet.offsetWidth}px`);
  };

  updateMetrics();
  window.addEventListener("resize", updateMetrics);
}

setupBrandCarousel();
setupFeaturedFilters();
