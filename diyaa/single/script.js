/**
 * Update main product image on thumbnail click
 * @param {HTMLElement} element 
 */
function changeMainImage(element) {
  const mainImage = document.getElementById('mainProductImage');
  const selectedSrc = element.querySelector('img').getAttribute('src');
  
  mainImage.src = selectedSrc;
  
  document.querySelectorAll('.product-thumbnails .thumb-box').forEach(thumb => {
    thumb.classList.remove('active');
  });
  
  element.classList.add('active');
}

/**
 * Handle selection of color options
 * @param {HTMLElement} element 
 */
function selectColor(element) {
  document.querySelectorAll('.color-thumb').forEach(thumb => {
    thumb.classList.remove('active');
  });
  
  element.classList.add('active');
  
  const colorName = element.getAttribute('data-color');
  document.getElementById('selectedColorName').textContent = colorName;
}

/**
 * Handle button selections for Style and Size
 * @param {HTMLElement} element 
 * @param {string} targetLabelId 
 */
function selectOption(element, targetLabelId) {
  const parentContainer = element.parentElement;
  
  parentContainer.querySelectorAll('.btn-option').forEach(btn => {
    btn.classList.remove('active');
  });
  
  element.classList.add('active');
  
  document.getElementById(targetLabelId).textContent = element.textContent.trim();
}

/**
 * Handle quantity increment and decrement
 * @param {number} change 
 */
function updateQuantity(change) {
  const quantityInput = document.getElementById('productQuantity');
  let currentVal = parseInt(quantityInput.value) || 1;
  
  currentVal += change;
  
  if (currentVal < 1) {
    currentVal = 1;
  }
  
  quantityInput.value = currentVal;
}
