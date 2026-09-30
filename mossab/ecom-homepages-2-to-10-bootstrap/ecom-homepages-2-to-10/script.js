/* SHARED JAVASCRIPT: ordinary variables, functions, arrays and DOM events. */
/* Bootstrap controls navbar, dropdown, tabs, account modal and the cart panel. */

// MOSSAB: find the buttons and counters once.
const cartCount = document.querySelector("#cart-count");
const wishCount = document.querySelector("#wish-count");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const notice = document.querySelector("#notice");
let cart = [];
let saved = [];
let noticeTimer;

// Shared: use sessionStorage to keep the cart while moving between homepages.
try {
  cart = JSON.parse(sessionStorage.getItem("ecom-cart")) || [];
  saved = JSON.parse(sessionStorage.getItem("ecom-saved")) || [];
} catch (error) {
  cart = [];
  saved = [];
}

function showNotice(message) {
  notice.textContent = message;
  notice.classList.add("show");
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(function () {
    notice.classList.remove("show");
  }, 2500);
}

function saveData() {
  try {
    sessionStorage.setItem("ecom-cart", JSON.stringify(cart));
    sessionStorage.setItem("ecom-saved", JSON.stringify(saved));
  } catch (error) {
    // The page still works if the browser disables storage.
  }
}

function updateCart() {
  cartItems.textContent = "";
  let quantity = 0;
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    quantity += cart[i].quantity;
    total += cart[i].price * cart[i].quantity;
    // textContent treats a product name as text instead of HTML.
    const row = document.createElement("div");
    row.className = "cart-row";
    const name = document.createElement("p");
    name.textContent = cart[i].name;
    const price = document.createElement("p");
    price.textContent = cart[i].quantity + " × $" + cart[i].price.toFixed(2);
    const remove = document.createElement("button");
    remove.className = "btn btn-sm btn-outline-danger";
    remove.textContent = "Remove";
    remove.addEventListener("click", function () {
      cart.splice(i, 1);
      saveData();
      updateCart();
    });
    row.append(name, price, remove);
    cartItems.append(row);
  }
  if (cart.length === 0) cartItems.textContent = "Your cart is empty.";
  cartCount.textContent = quantity;
  cartTotal.textContent = total.toFixed(2);
}

// DIYAA / MONTASER / MOSSAB: product buttons all use the same simple function.
const cards = document.querySelectorAll(".product-card");
cards.forEach(function (card) {
  const wishButton = card.querySelector(".wish-button");
  const productName = card.dataset.name;
  wishButton.setAttribute("aria-pressed", saved.includes(productName));
  card.querySelector(".add-cart").addEventListener("click", function () {
    let found = false;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].name === productName) {
        cart[i].quantity++;
        found = true;
        break;
      }
    }
    if (!found)
      cart.push({
        name: productName,
        price: Number(card.dataset.price),
        quantity: 1,
      });
    saveData();
    updateCart();
    showNotice("Product added to cart.");
  });
  wishButton.addEventListener("click", function () {
    const index = saved.indexOf(productName);
    if (index === -1) saved.push(productName);
    else saved.splice(index, 1);
    // A product can appear in more than one section.
    cards.forEach(function (other) {
      other
        .querySelector(".wish-button")
        .setAttribute("aria-pressed", saved.includes(other.dataset.name));
    });
    wishCount.textContent = saved.length;
    saveData();
  });
});

// MOSSAB: search only the product cards on the open homepage.
const searchForm = document.querySelector(".search-form");
function filterCards(query, onlySaved, scope) {
  let visible = 0;
  scope.querySelectorAll(".product-card").forEach(function (card) {
    const matchesText = card.dataset.name
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesSaved = !onlySaved || saved.includes(card.dataset.name);
    card.closest(".product-column").hidden = !(matchesText && matchesSaved);
    if (matchesText && matchesSaved) visible++;
  });
  return visible;
}
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const query = searchForm.querySelector("input").value.trim();
  const visible = filterCards(query, false, document);
  showNotice(
    visible
      ? "Matching cards: " + visible
      : "No products found. Clear the search to show all.",
  );
  document
    .querySelector("#products-start")
    .scrollIntoView({ behavior: "smooth" });
});
searchForm.querySelector("input").addEventListener("input", function (event) {
  if (event.target.value === "") filterCards("", false, document);
});
document.querySelector("#show-wishlist").addEventListener("click", function () {
  filterCards("", true, document);
  showNotice(
    saved.length
      ? "Showing saved products. Search with an empty field to show all."
      : "Save a product with the heart button first.",
  );
});
document.querySelectorAll("[data-filter]").forEach(function (button) {
  button.addEventListener("click", function () {
    const section = button.closest(".page-section");
    filterCards("", button.dataset.filter === "saved", section);
    section.querySelectorAll("[data-filter]").forEach(function (other) {
      other.classList.toggle("active", other === button);
    });
  });
});

// JAN: subscription is a front-end exercise; no email is sent.
document.querySelectorAll(".newsletter-form").forEach(function (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    form.parentElement.querySelector(".newsletter-message").textContent =
      "Thank you! This demo does not send emails.";
    form.reset();
  });
});
document.querySelectorAll(".news-open").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelector("#news-title").textContent = button.dataset.title;
    new bootstrap.Modal(document.querySelector("#newsModal")).show();
  });
});
document.querySelector("#back-top").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.querySelector("#clear-cart").addEventListener("click", function () {
  cart = [];
  saveData();
  updateCart();
});
updateCart();
wishCount.textContent = saved.length;
