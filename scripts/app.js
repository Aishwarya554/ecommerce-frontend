console.log("Script loaded!");

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// DOM elements
const grid = document.getElementById("product-grid");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const API_URL = "https://fakestoreapi.com/products";

// Show loading by default
loading.style.display = "block";
error.style.display = "none";

// Check for cached data
const cached = localStorage.getItem("products");
if (cached) {
  const products = JSON.parse(cached);
  displayProducts(products);
  loading.style.display = "none";
}

// Always fetch fresh data from API
fetch(API_URL)
  .then(res => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  })
  .then(products => {
    // Save to localStorage
    localStorage.setItem("products", JSON.stringify(products));

console.log("Products saved to localStorage!");

    // Only update UI if not using cache
    if (!cached) {
      displayProducts(products);
      loading.style.display = "none";
    }
  })
  .catch(err => {
    console.error("Failed to fetch products:", err);
    if (!cached) {
      loading.style.display = "none";
      error.style.display = "block";
    }
  });

// Display product cards
function displayProducts(products) {
  grid.innerHTML = ""; // Clear previous content
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title || product.name}" loading="lazy">
      <h3>${product.title || product.name}</h3>
      <p>$${product.price}</p>
      <button>Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Handle "Add to Cart" click
document.addEventListener("click", function (e) {
  if (e.target && e.target.textContent === "Add to Cart") {
    alert("Item added to cart!");
  }
});
