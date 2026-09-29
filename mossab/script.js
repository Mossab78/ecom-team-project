// Shared helper: show a short message after a demo action.
const toast = document.querySelector("#toast");
let toastTimer;
function showMessage(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// SECTION 3: Jan — change only the hero image and text when a dot is clicked.
const slides = [
  {
    label: "HOT RIGHT NOW",
    line: "Sale Up to 50% Off",
    title: "Mobile Devices",
    image: "assets/banner.png",
    color: "#e4f1ff",
  },
  {
    label: "TRENDING NOW",
    line: "Big Sale 25%",
    title: "Laptop & PC",
    image: "assets/banner-hero-2.png",
    color: "#dff4e0",
  },
  {
    label: "TOP SALE THIS MONTH",
    line: "Hot Collection",
    title: "Virtual glasses",
    image: "assets/banner-hero-3.png",
    color: "#ffe9e6",
  },
];
document.querySelectorAll("[data-slide]").forEach((dot) => {
  dot.addEventListener("click", () => {
    const slide = slides[Number(dot.dataset.slide)];
    document.querySelector("#hero-eyebrow").textContent = slide.label;
    document.querySelector("#hero-topline").textContent = slide.line;
    document.querySelector("#hero-title").textContent = slide.title;
    document.querySelector("#hero-main").style.background =
      `${slide.color} url('${slide.image}') right bottom / cover no-repeat`;
    document
      .querySelectorAll("[data-slide]")
      .forEach((button) => button.classList.remove("active"));
    dot.classList.add("active");
  });
});

// SECTION 5: Mossab and SECTION 8: Montaser — each row of tabs filters its own cards.
document.querySelectorAll(".product-tabs").forEach((tabBar) => {
  tabBar.querySelectorAll("button").forEach((button) =>
    button.addEventListener("click", () => {
      tabBar
        .querySelectorAll("button")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const cards = document.querySelectorAll(
        `#${tabBar.dataset.target} .product-card`,
      );
      cards.forEach((card) => {
        card.hidden =
          button.dataset.filter !== "all" &&
          card.dataset.group !== button.dataset.filter;
      });
    }),
  );
});

// SECTION 1 and shared product cards: keep demo counters in the header.
let cartCount = 2;
let wishlistCount = 5;
document.querySelectorAll(".cart-button").forEach((button) =>
  button.addEventListener("click", () => {
    document.querySelector("#cart-count").textContent = ++cartCount;
    showMessage("Product added to the demo cart");
  }),
);
document.querySelectorAll(".heart").forEach((button) =>
  button.addEventListener("click", () => {
    const saved = button.classList.toggle("saved");
    button.textContent = saved ? "♥" : "♡";
    document.querySelector("#wishlist-count").textContent = wishlistCount +=
      saved ? 1 : -1;
    showMessage(saved ? "Added to wishlist" : "Removed from wishlist");
  }),
);

// SECTION 1: Mossab — search product cards already visible on this homepage.
document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document
    .querySelector("#search-input")
    .value.trim()
    .toLowerCase();
  const category = document.querySelector("#search-category").value;
  let matches = 0;
  document.querySelectorAll("#best-grid .product-card").forEach((card) => {
    const textMatch = card.textContent.toLowerCase().includes(query);
    const categoryMatch =
      category === "all" || card.dataset.category === category;
    card.hidden = !textMatch || !categoryMatch;
    if (!card.hidden) matches++;
  });
  document
    .querySelector("#best-sellers")
    .scrollIntoView({ behavior: "smooth" });
  showMessage(`${matches} matching product${matches === 1 ? "" : "s"} found`);
});

// SECTION 10: Jan — demonstrate form validation without collecting emails.
document
  .querySelector("#newsletter-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    event.target.reset();
    showMessage("Thanks! This is a demo form.");
  });