"use strict";

/* ============ Status messages start ============ */
const notice = document.getElementById("notice");
let noticeTimer;
function showMessage(message) {
    notice.textContent = message;
    notice.classList.add("show");
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(function () {
        notice.classList.remove("show");
    }, 2500);
}
/* ============ Status messages end ============ */

/* ============ Slider navigation start ============ */
function activeTabSlider(selector) {
    const slider = document.querySelector(selector);
    const pane = slider ? slider.closest(".tab-pane") : null;
    if (!pane) return slider;
    const active = pane.parentElement.querySelector(".tab-pane.active");
    return active ? active.querySelector(".carousel, .product-slider") || slider : slider;
}
document.querySelectorAll("[data-bs-slide]").forEach(function (button) {
    button.addEventListener("click", function () {
        const slider = activeTabSlider(button.getAttribute("data-bs-target"));
        if (slider) button.setAttribute("data-bs-target", "#" + slider.id);
    });
});
function moveTrack(track, direction) {
    const lastPosition = Math.max(0, track.scrollWidth - track.clientWidth);
    if (lastPosition < 2) return;
    const card = track.querySelector(".swiper-slide");
    const distance = card ? card.getBoundingClientRect().width : track.clientWidth;
    let nextPosition = track.scrollLeft + direction * distance;
    if (direction > 0 && track.scrollLeft >= lastPosition - 2) nextPosition = 0;
    if (direction < 0 && track.scrollLeft <= 2) nextPosition = lastPosition;
    track.scrollTo({ left: Math.max(0, Math.min(lastPosition, nextPosition)), behavior: "smooth" });
}
document.querySelectorAll("[data-slider]").forEach(function (button) {
    button.addEventListener("click", function () {
        const slider = activeTabSlider(button.dataset.slider);
        const track = slider ? slider.querySelector(".slider-track") : null;
        if (track) moveTrack(track, button.dataset.direction === "next" ? 1 : -1);
    });
});
/* ============ Slider navigation end ============ */

/* ============ Mouse dragging start ============ */
function enableMouseDrag(surface, track, carousel) {
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let ignoreClick = false;
    surface.addEventListener("dragstart", function (event) {
        event.preventDefault();
    });
    surface.addEventListener("pointerdown", function (event) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        if (event.target.closest("button, input, select, textarea")) return;
        dragging = true;
        moved = false;
        startX = event.clientX;
        startScroll = track ? track.scrollLeft : 0;
        if (carousel) carousel.pause();
    });
    surface.addEventListener("pointermove", function (event) {
        if (!dragging) return;
        const distance = event.clientX - startX;
        if (Math.abs(distance) < 8 && !moved) return;
        moved = true;
        surface.classList.add("is-dragging");
        surface.setPointerCapture(event.pointerId);
        event.preventDefault();
        if (track) track.scrollLeft = startScroll - distance;
    });
    function finishDrag(event) {
        if (!dragging) return;
        dragging = false;
        surface.classList.remove("is-dragging");
        if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
        if (moved) {
            ignoreClick = true;
            setTimeout(function () {
                ignoreClick = false;
            }, 100);
            if (carousel && event.type !== "pointercancel") {
                if (event.clientX - startX < -40) carousel.next();
                if (event.clientX - startX > 40) carousel.prev();
            }
        }
        if (carousel && !surface.closest("[data-gallery]")) carousel.cycle();
    }
    surface.addEventListener("pointerup", finishDrag);
    surface.addEventListener("pointercancel", finishDrag);
    surface.addEventListener("pointerleave", function (event) {
        if (dragging && !moved) finishDrag(event);
    });
    surface.addEventListener(
        "click",
        function (event) {
            if (!ignoreClick) return;
            event.preventDefault();
            event.stopPropagation();
        },
        true
    );
}
/* ============ Mouse dragging end ============ */

/* ============ Automatic banner and card movement start ============ */
document.querySelectorAll(".carousel").forEach(function (slider) {
    const carousel = new bootstrap.Carousel(slider, {
        interval: slider.hasAttribute("data-gallery") ? false : 10000,
        ride: slider.hasAttribute("data-gallery") ? false : "carousel",
        pause: "hover",
        wrap: true,
        touch: true,
    });
    enableMouseDrag(slider.querySelector(".carousel-inner"), null, carousel);
});
document.querySelectorAll(".slider-track").forEach(function (track) {
    enableMouseDrag(track, track, null);
    setInterval(function () {
        const position = track.getBoundingClientRect();
        if (document.hidden || track.classList.contains("is-dragging")) return;
        if (position.width === 0 || position.bottom < 0 || position.top > window.innerHeight) return;
        moveTrack(track, 1);
    }, 10000);
});
/* ============ Automatic banner and card movement end ============ */

/* ============ Shopping cart start ============ */
let cart = [];

try {
    cart = JSON.parse(sessionStorage.getItem("ecom-cart-v3")) || [];
} catch (error) {
    cart = [];
}

const cartItems = document.getElementById("cart-items");

function updateCart() {
    if (cartItems) {
        cartItems.replaceChildren();
    }

    const cartPageItems = document.getElementById("cart-page-items");

    if (cartPageItems) {
        cartPageItems.replaceChildren();
    }

    let total = 0;
    let count = 0;

    cart.forEach(function (item, index) {
        const subtotal = Number(item.price) * Number(item.quantity);

        total += subtotal;
        count += Number(item.quantity);

        // Sidebar cart
        if (cartItems) {
            const row = document.createElement("div");
            row.className = "cart-row d-flex justify-content-between gap-3 align-items-center";

            if (item.image) {
                const image = document.createElement("img");
                image.src = item.image;
                image.alt = item.name;
                image.className = "cart-sidebar-image";
                row.append(image);
            }

            const label = document.createElement("span");
            label.textContent =
                item.name + " × " + item.quantity + " — $" +
                subtotal.toFixed(2);

            const remove = document.createElement("button");
            remove.className = "cart-remove btn btn-sm";
            remove.type = "button";
            remove.textContent = "Remove";

            remove.addEventListener("click", function () {
                cart.splice(index, 1);
                updateCart();
            });

            row.append(label, remove);
            cartItems.append(row);
        }

        // Cart page
        if (cartPageItems) {
            const pageRow = document.createElement("div");
            pageRow.className =
                "item-wishlist rounded-1 d-flex w-100 align-items-center";

            const product = document.createElement("div");
            product.className = "wishlist-product";

            // Product image
            if (item.image) {
                const image = document.createElement("img");
                image.src = item.image;
                image.alt = item.name;
                image.className = "cart-product-image";
                product.append(image);
            }

            const name = document.createElement("h6");
            name.className = "color-brand-3 fs-6 fw-bold";
            name.textContent = item.name;
            product.append(name);

            const price = document.createElement("div");
            price.className = "wishlist-price text-center";

            const priceText = document.createElement("h4");
            priceText.className = "color-brand-3 fw-bold";
            priceText.textContent = "$" + Number(item.price).toFixed(2);
            price.append(priceText);

            const quantity = document.createElement("div");
            quantity.className = "wishlist-status text-center";

            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.min = "1";
            quantityInput.value = item.quantity;
            quantityInput.className = "form-control text-center";
            quantityInput.setAttribute("aria-label", "Product quantity");

            quantityInput.addEventListener("change", function () {
                item.quantity = Math.max(
                    1,
                    Number(quantityInput.value) || 1
                );
                updateCart();
            });

            quantity.append(quantityInput);

            const subtotalCell = document.createElement("div");
            subtotalCell.className = "wishlist-action text-center";

            const subtotalText = document.createElement("h4");
            subtotalText.className = "color-brand-3 fw-bold";
            subtotalText.textContent = "$" + subtotal.toFixed(2);
            subtotalCell.append(subtotalText);
const removeCell = document.createElement("div");
            removeCell.className = "wishlist-remove text-center";

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "btn btn-delete";
            removeButton.textContent = "Remove";

            removeButton.addEventListener("click", function () {
                cart.splice(index, 1);
                updateCart();
            });

            removeCell.append(removeButton);

            pageRow.append(
                product,
                price,
                quantity,
                subtotalCell,
                removeCell
            );

            cartPageItems.append(pageRow);
        }
    });

    if (!cart.length) {
        if (cartItems) {
            cartItems.textContent = "Your cart is empty.";
        }

        if (cartPageItems) {
            cartPageItems.textContent = "Your cart is empty.";
        }
    }

    const cartTotal = document.getElementById("cart-total");

    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }

    const badge = document.getElementById("cart-count");

    if (badge) {
        badge.textContent = count;
    }

    const pageSubtotal = document.getElementById("cart-page-subtotal");
    const pageTotal = document.getElementById("cart-page-total");

    if (pageSubtotal) {
        pageSubtotal.textContent = "$" + total.toFixed(2);
    }

    if (pageTotal) {
        pageTotal.textContent = "$" + total.toFixed(2);
    }

    try {
        sessionStorage.setItem("ecom-cart-v3", JSON.stringify(cart));
    } catch (error) {
        /* Cart still works without storage. */
    }
}

document.querySelectorAll(".add-cart").forEach(function (button) {
    button.addEventListener("click", function (event) {
        const card = button.closest(".product-card");

        if (!card) return;

        event.preventDefault();

        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        const existing = cart.find(function (item) {
            return item.name === name;
        });

        const quantityField = card.querySelector("[data-quantity]");
        const quantity = quantityField
            ? Math.max(1, Number(quantityField.value) || 1)
            : 1;

        // Get product image
        const image = card.querySelector("img");

        if (existing) {
            existing.quantity += quantity;

            if (!existing.image && image) {
                existing.image = image.src;
            }
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: quantity,
                image: image ? image.src : ""
            });
        }

        updateCart();
        showMessage("Added to cart.");
    });
});

const clearCartButton = document.getElementById("clear-cart");

if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
        cart = [];
        updateCart();
    });
}

updateCart();

/* ============ Shopping cart end ============ */

/* ============ Wishlist and quick view start ============ */
document.querySelectorAll(".wish-button").forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        const card = button.closest(".product-card");
        if (!card) return;
        const favorite = card.classList.toggle("is-favorite");
        button.setAttribute("aria-pressed", favorite);
        showMessage(favorite ? "Added to wishlist." : "Removed from wishlist.");
    });
});
document.getElementById("quickView").addEventListener("show.bs.modal", function (event) {
    const card = event.relatedTarget ? event.relatedTarget.closest(".product-card") : null;
    document.getElementById("quick-title").textContent = card ? card.dataset.name : "Product preview";
    document.getElementById("quick-description").textContent = card
        ? "Price: $" + Number(card.dataset.price).toFixed(2)
        : "Open the product page for its details.";
});
/* ============ Wishlist and quick view end ============ */

/* ============ Search start ============ */
document.querySelectorAll(".search-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const query = form.querySelector("input").value.trim().toLowerCase();
        let matches = 0;
        document.querySelectorAll(".product-card").forEach(function (card) {
            const match = card.dataset.name.toLowerCase().includes(query);
            const column = card.closest(".products-grid > .col, .swiper-slide") || card;
            column.classList.toggle("d-none", !match);
            if (match) matches += 1;
        });
        showMessage(query ? matches + " matching product cards." : "All products are visible again.");
    });
});
/* ============ Search end ============ */

/* ============ Newsletter start ============ */
document.querySelectorAll(".newsletter-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        showMessage("Demo form: your email has not been sent.");
        form.reset();
    });
});
/* ============ Newsletter end ============ */

/* ============ Back to top start ============ */
document.getElementById("back-top").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
/* ============ Back to top end ============ */

/* ============ Bootstrap breakpoint dimensions start ============ */
// Bootstrap decides the breakpoints. The classes add reference-only dimensions.
function updateReferenceDimensions() {
    const wide = document.getElementById("wideBreakpoint");
    const desktop = document.getElementById("desktopBreakpoint");
    document.body.classList.toggle("ecom-wide", getComputedStyle(wide).display !== "none");
    document.body.classList.toggle("ecom-desktop", getComputedStyle(desktop).display !== "none");
}
window.addEventListener("resize", updateReferenceDimensions);
updateReferenceDimensions();
/* ============ Bootstrap breakpoint dimensions end ============ */

/* ============ Category navigation start ============ */
const categoryRail = document.getElementById("category-rail");
if (categoryRail) {
    document.querySelectorAll("[data-category]").forEach(function (link) {
        link.addEventListener("click", function () {
            const category = document.getElementById("category-" + link.dataset.category);
            if (category) bootstrap.Collapse.getOrCreateInstance(category, { toggle: false }).show();
        });
    });
}
/* ============ Category navigation end ============ */

/* ============ Product quantity start ============ */
document.querySelectorAll(".box-quantity").forEach(function (box) {
    const input = box.querySelector("input");
    if (!input) return;
    box.querySelectorAll(".plus-cart, .minus-cart").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const change = button.classList.contains("plus-cart") ? 1 : -1;
            input.value = Math.max(1, (Number(input.value) || 1) + change);
        });
    });
});
/* ============ Product quantity end ============ */
/* ============ Local forms start ============ */
document.querySelectorAll("[data-local-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const passwords = form.querySelectorAll("input[type=password]");
        if (passwords.length > 1 && passwords[0].value !== passwords[1].value) {
            showMessage("The passwords must match.");
            return;
        }
        showMessage("Demo form completed. No information was sent.");
    });
});
/* ============ Local forms end ============ */
/* ============ Selection controls start ============ */
document.querySelectorAll(".cb-all").forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
        const panel = checkbox.closest(".tab-pane") || document.querySelector("main");
        panel.querySelectorAll(".cb-select").forEach(function (item) {
            item.checked = checkbox.checked;
        });
    });
});
/* ============ Selection controls end ============ */

/* ============ Category button start ============ */
const categoryButton = document.querySelector("#category-rail .btn-open");
const stickyHeader = document.querySelector(".ecom-main-header");
if (categoryButton && stickyHeader) {
    const headerStart = stickyHeader.offsetTop;
    function updateCategoryButton() {
        categoryButton.classList.toggle("ecom-category-compact", window.scrollY > headerStart);
    }
    window.addEventListener("scroll", updateCategoryButton, { passive: true });
    updateCategoryButton();
}
/* ============ Category button end ============ */

/* ============ Cart table controls start ============ */
document.querySelectorAll(".content-wishlist .btn-delete").forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        const row = button.closest(".item-wishlist");
        if (row) row.remove();
        showMessage("Item removed from the displayed list.");
    });
});
/* ============ Cart table controls end ============ */

/* ============ Sort menu labels start ============ */
document.querySelectorAll(".dropdown-sort .dropdown-item").forEach(function (item) {
    item.addEventListener("click", function (event) {
        event.preventDefault();
        const menu = item.closest(".dropdown-sort");
        menu.querySelectorAll(".dropdown-item").forEach(function (link) {
            link.classList.remove("active");
        });
        item.classList.add("active");
        menu.querySelector(".dropdown-toggle").textContent = item.textContent;
    });
});
/* ============ Sort menu labels end ============ */

/* ============ Product sorting and price filters start ============ */
const shopMain = document.querySelector("main .shop-template");
if (shopMain) {
    const firstCard = shopMain.querySelector(".card-grid-inner.product-card");
    const productRow = firstCard ? firstCard.closest(".row") : null;
    if (productRow) {
        const productColumns = Array.from(productRow.children);
        document.querySelectorAll("#dropdownSort + .dropdown-menu .dropdown-item").forEach(function (item, index) {
            item.addEventListener("click", function () {
                const ordered = productColumns.slice();
                if (index === 1) ordered.reverse();
                if (index === 2)
                    ordered.sort(function (a, b) {
                        const ratingA = a.querySelector(".rating");
                        const ratingB = b.querySelector(".rating");
                        const numberA = ratingA ? Number(ratingA.textContent.replace(/[^0-9]/g, "")) : 0;
                        const numberB = ratingB ? Number(ratingB.textContent.replace(/[^0-9]/g, "")) : 0;
                        return numberB - numberA;
                    });
                ordered.forEach(function (column) {
                    productRow.append(column);
                });
            });
        });
        const minPrice = document.querySelector(".min-value");
        const maxPrice = document.querySelector(".max-value");
        function filterPrices() {
            const minimum = minPrice && minPrice.value ? Number(minPrice.value) : 0;
            const maximum = maxPrice && maxPrice.value ? Number(maxPrice.value) : Infinity;
            productColumns.forEach(function (column) {
                const card = column.querySelector(".product-card");
                if (!card) return;
                const price = Number(card.dataset.price);
                column.classList.toggle("d-none", price < minimum || price > maximum);
            });
        }
        if (minPrice) minPrice.addEventListener("change", filterPrices);
        if (maxPrice) maxPrice.addEventListener("change", filterPrices);
    }
}
/* ============ Product sorting and price filters end ============ */

/* ============ Account tab links start ============ */
if (document.body.dataset.pageKind === "commerce" && window.location.hash) {
    const target = document.querySelector(
        '[data-bs-toggle="tab"][href="' + window.location.hash.replace(/[^a-zA-Z0-9#-]/g, "") + '"]'
    );
    if (target) bootstrap.Tab.getOrCreateInstance(target).show();
}
/* ============ Account tab links end ============ */
