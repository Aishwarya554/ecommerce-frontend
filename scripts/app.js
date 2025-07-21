console.log("Script loaded!");

// ✅ Hamburger menu toggle
let allProducts = []; // ✅ Global storage for all products

 const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
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
      allProducts = products;
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
        <img data-src="${product.image}" alt="${product.title || product.name}" class="lazy-img">
        <h3>${product.title || product.name}</h3>
      </a>
      <p>$${product.price}</p>
      <button>Add to Cart</button>
    `;

    grid.appendChild(card);
  });

  // ✅ Trigger lazy loading after DOM update
  initLazyLoading();
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

    const existingIndex = cart.findIndex(
      (item) => item.name === product.name && item.image === product.image
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

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
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countSpan.textContent = totalItems;
  }
}

// ✅ Call on page load
updateCartCount();

// ✅ JS-based Lazy Loading using IntersectionObserver
function initLazyLoading() {
  const lazyImages = document.querySelectorAll(".lazy-img");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy-img");
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}
const searchInput = document.querySelector(".search-bar");

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  const filteredProducts = allProducts.filter(product => {
    const title = product.title || product.name || "";
    const category = product.category || "";
    return (
      title.toLowerCase().includes(searchTerm) ||
      category.toLowerCase().includes(searchTerm)
    );
  });

  displayProducts(filteredProducts);
});
