console.log("Script loaded!");

// ✅ Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ✅ DOM elements
const grid = document.getElementById("product-grid");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const API_URL = "https://fakestoreapi.com/products";

// ✅ Show loading initially
loading.style.display = "block";
error.style.display = "none";

// ✅ Use cached data if available
const cached = localStorage.getItem("products");
if (cached) {
  const products = JSON.parse(cached);
  displayProducts(products);
  loading.style.display = "none";
}

// ✅ Always fetch fresh data from API
fetch(API_URL)
  .then(res => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  })
  .then(products => {
    localStorage.setItem("products", JSON.stringify(products));
    console.log("Products saved to localStorage!");

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

// ✅ Function to render products
function displayProducts(products) {
  grid.innerHTML = ""; // clear grid

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-link">
        <img src="${product.image}" alt="${product.title || product.name}" loading="lazy">
        <h3>${product.title || product.name}</h3>
      </a>
      <p>$${product.price}</p>
      <button>Add to Cart</button>
    `;

    grid.appendChild(card);
  });
}

// ✅ Handle "Add to Cart" click
document.addEventListener("click", function (e) {
  if (e.target && e.target.textContent === "Add to Cart") {
    const productCard = e.target.closest(".product-card");
    const name = productCard.querySelector("h3").textContent;
    const price = productCard.querySelector("p").textContent;
    const image = productCard.querySelector("img").src;

    const product = { name, price, image, quantity: 1 };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // ✅ Check for duplicate by name and image (can adjust logic if needed)
    const existingIndex = cart.findIndex(
      (item) => item.name === product.name && item.image === product.image
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1; // ✅ Update quantity
    } else {
      cart.push(product); // ✅ Add new
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    // ✅ Show animated feedback (toast)
    const message = document.getElementById("cart-message");
    if (message) {
      message.classList.add("show");
      setTimeout(() => {
        message.classList.remove("show");
      }, 2000);
    }
  }
});

// ✅ Update cart count in navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countSpan = document.querySelector(".cart-count");

  if (countSpan) {
    // ✅ Count total quantity of all items
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countSpan.textContent = totalItems;
  }
}

// ✅ Call on page load
updateCartCount();
