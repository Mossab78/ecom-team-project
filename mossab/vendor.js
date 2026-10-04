/* MOSSAB: Plain JavaScript. Read one numbered section at a time. */
/* 1. Find the cards and remember their original order. */
const grid = document.getElementById('cardsGrid');
const cards = Array.from(document.querySelectorAll('[data-card]'));
const pageType = document.body.dataset.page;
let currentPage = 1;
let searchWord = '';
let maximumPrice = '';
let cart = [];
let wishlist = [];
let compared = [];
let messageTimer;

/* Storage can be unavailable in private browsing, so use a small fallback. */
try {
  cart = JSON.parse(sessionStorage.getItem('mossabVendorCart')) || [];
  wishlist = JSON.parse(sessionStorage.getItem('mossabVendorWishlist')) || [];
} catch (error) {
  cart = [];
  wishlist = [];
}

/* 2. Show a short message without leaving the page. */
function showMessage(message) {
  const box = document.getElementById('statusMessage');
  box.textContent = message;
  box.hidden = false;
  clearTimeout(messageTimer);
  messageTimer = setTimeout(function () { box.hidden = true; }, 3500);
}

/* 3. Search, sort and paginate the existing HTML cards. */
function displayCards() {
  const sortValue = document.getElementById('sortSelect').value;
  const pageSize = Number(document.getElementById('pageSize').value);
  const matching = cards.filter(function (card) {
    const name = card.dataset.name.toLowerCase();
    const nameMatches = name.includes(searchWord.toLowerCase());
    const priceMatches = maximumPrice === '' || Number(card.dataset.price) <= Number(maximumPrice);
    return nameMatches && priceMatches;
  });
  matching.sort(function (a, b) {
    if (sortValue === 'name') return a.dataset.name.localeCompare(b.dataset.name);
    if (sortValue === 'price') return Number(a.dataset.price) - Number(b.dataset.price);
    if (sortValue === 'oldest') return Number(b.dataset.order) - Number(a.dataset.order);
    return Number(a.dataset.order) - Number(b.dataset.order);
  });
  const pages = Math.max(1, Math.ceil(matching.length / pageSize));
  if (currentPage > pages) currentPage = pages;
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, matching.length);
  cards.forEach(function (card) {
    const wrapper = pageType === 'list' ? card.parentElement : card;
    wrapper.hidden = true;
  });
  matching.forEach(function (card, index) {
    const wrapper = pageType === 'list' ? card.parentElement : card;
    grid.appendChild(wrapper);
    wrapper.hidden = index < start || index >= end;
  });
  document.getElementById('resultCount').textContent = matching.length === 0
    ? 'No results found' : 'Showing ' + (start + 1) + '–' + end + ' of ' + matching.length + ' results';
  const pagination = document.getElementById('pagination');
  pagination.replaceChildren();
  for (let number = 1; number <= pages; number++) {
    const item = document.createElement('li');
    item.className = 'page-item';
    const button = document.createElement('button');
    button.className = 'page-link' + (number === currentPage ? ' active' : '');
    button.textContent = number;
    if (number === currentPage) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', function () {
      currentPage = number;
      displayCards();
      grid.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
    item.appendChild(button);
    pagination.appendChild(item);
  }
}

document.getElementById('searchForm').addEventListener('submit', function (event) {
  event.preventDefault();
  searchWord = document.getElementById('searchInput').value.trim();
  currentPage = 1;
  displayCards();
});
['sortSelect', 'pageSize'].forEach(function (id) {
  document.getElementById(id).addEventListener('change', function () {
    currentPage = 1;
    displayCards();
  });
});
document.getElementById('priceFilter').hidden = pageType === 'list';
document.getElementById('filterForm').addEventListener('submit', function (event) {
  event.preventDefault();
  searchWord = document.getElementById('filterText').value.trim();
  maximumPrice = document.getElementById('maxPrice').value;
  document.getElementById('searchInput').value = searchWord;
  currentPage = 1;
  displayCards();
  bootstrap.Modal.getInstance(document.getElementById('ModalFiltersForm')).hide();
});
document.getElementById('resetFilters').addEventListener('click', function () {
  document.getElementById('filterForm').reset();
  document.getElementById('searchInput').value = '';
  searchWord = '';
  maximumPrice = '';
  currentPage = 1;
  displayCards();
});

/* 4. Switch between grid and list layouts using one CSS class. */
function changeView(listMode) {
  grid.classList.toggle('list-view', listMode);
  document.getElementById('listView').classList.toggle('active', listMode);
  document.getElementById('gridView').classList.toggle('active', !listMode);
  document.getElementById('listView').setAttribute('aria-pressed', String(listMode));
  document.getElementById('gridView').setAttribute('aria-pressed', String(!listMode));
}
document.getElementById('gridView').addEventListener('click', function () { changeView(false); });
document.getElementById('listView').addEventListener('click', function () { changeView(true); });

/* 5. Cart records contain a name, price, original image URL and quantity. */
function saveCart() {
  try {
    sessionStorage.setItem('mossabVendorCart', JSON.stringify(cart));
    sessionStorage.setItem('mossabVendorWishlist', JSON.stringify(wishlist));
  } catch (error) { /* The demo still works without storage. */ }
}
function updateCart() {
  const box = document.getElementById('cartItems');
  box.replaceChildren();
  let total = 0;
  let quantity = 0;
  cart.forEach(function (product, index) {
    total += product.price * product.quantity;
    quantity += product.quantity;
    const row = document.createElement('div');
    row.className = 'border-bottom py-3';
    const title = document.createElement('p');
    title.textContent = product.name;
    const price = document.createElement('p');
    price.textContent = product.quantity + ' × $' + product.price.toFixed(2);
    const remove = document.createElement('button');
    remove.className = 'btn btn-sm btn-light mt-2';
    remove.textContent = 'Remove';
    remove.addEventListener('click', function () { cart.splice(index, 1); saveCart(); updateCart(); });
    row.append(title, price, remove);
    box.appendChild(row);
  });
  if (cart.length === 0) box.textContent = 'Your cart is empty.';
  document.getElementById('cartCount').textContent = quantity;
  document.getElementById('cartTotal').textContent = total.toFixed(2);
  document.getElementById('wishlistCount').textContent = wishlist.length;
}

/* 6. Connect the product buttons to cart, wishlist, compare and preview. */
cards.forEach(function (card) {
  if (card.dataset.card !== 'product') return;
  const product = {
    name: card.dataset.name,
    price: Number(card.dataset.price),
    image: card.querySelector('.image-box img').src,
    quantity: 1
  };
  card.querySelector('.btn-cart').addEventListener('click', function () {
    const existing = cart.find(function (item) { return item.name === product.name; });
    if (existing) existing.quantity++;
    else cart.push({name: product.name, price: product.price, image: product.image, quantity: 1});
    saveCart();
    updateCart();
    showMessage('Added to your cart.');
  });
  const wishButton = card.querySelector('.btn-wishlist');
  wishButton.classList.toggle('selected', wishlist.includes(product.name));
  wishButton.addEventListener('click', function () {
    const index = wishlist.indexOf(product.name);
    if (index === -1) wishlist.push(product.name);
    else wishlist.splice(index, 1);
    cards.forEach(function (other) {
      const button = other.querySelector('.btn-wishlist');
      if (button) button.classList.toggle('selected', wishlist.includes(other.dataset.name));
    });
    saveCart();
    updateCart();
    showMessage(index === -1 ? 'Added to wishlist.' : 'Removed from wishlist.');
  });
  card.querySelector('.btn-compare').addEventListener('click', function () {
    if (!compared.includes(product.name)) compared.push(product.name);
    showMessage('Compare selection: ' + compared.length + ' products.');
  });
  card.querySelector('.btn-quickview').addEventListener('click', function () {
    document.getElementById('quickTitle').textContent = product.name;
    const content = document.getElementById('quickContent');
    content.replaceChildren();
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.style.maxHeight = '250px';
    image.className = 'd-block mx-auto';
    const price = document.createElement('p');
    price.className = 'text-center fw-bold mt-3';
    price.textContent = '$' + product.price.toFixed(2);
    content.append(image, price);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('quickView')).show();
  });
});
document.getElementById('wishlistButton').addEventListener('click', function () {
  showMessage(wishlist.length === 0 ? 'Your wishlist is empty.' : wishlist.join(' • '));
});
document.getElementById('compareButton').addEventListener('click', function () {
  showMessage(compared.length === 0 ? 'Select products to compare using ⇄.' : compared.join(' • '));
});
document.getElementById('clearCart').addEventListener('click', function () {
  cart = [];
  saveCart();
  updateCart();
});

/* 7. A local subscription confirmation. This does not send email. */
document.querySelector('.form-newsletter').addEventListener('submit', function (event) {
  event.preventDefault();
  showMessage('Thank you! This is a demo subscription; no email was sent.');
  event.target.reset();
});
/* Template placeholder links have no backend; explain instead of jumping. */
document.querySelectorAll('a[href="#"]:not([data-bs-toggle])').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    showMessage('Demo link: this service is not connected yet.');
  });
});
document.getElementById('backToTop').addEventListener('click', function () {
  window.scrollTo({top: 0, behavior: 'smooth'});
});
displayCards();
updateCart();
