console.log("Script loaded!");

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Hamburger menu toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("open");
    });
  }

  // ✅ Home page product loading
  const grid = document.getElementById("product-grid");
  if (grid) {
    loadProducts(grid);
  }

  // ✅ Cart page logic
  const cartContainer = document.getElementById("cart-items-container");
  if (cartContainer) {
    renderCart(cartContainer);
  }

  // ✅ Shared cart count update
  updateCartCount();
});

// ====================== FUNCTIONS ====================== //

// Load Products
function loadProducts(grid) {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const searchInput = document.querySelector(".search-bar");
  const API_URL = "https://fakestoreapi.com/products";
  let allProducts = [];

  loading.style.display = "block";
  error.style.display = "none";

  const cached = localStorage.getItem("products");
  if (cached) {
    allProducts = JSON.parse(cached);
    displayProducts(allProducts, grid);
    loading.style.display = "none";
  }

  fetch(API_URL)
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      localStorage.setItem("products", JSON.stringify(products));
      if (!cached) {
        displayProducts(products, grid);
        loading.style.display = "none";
      }
    })
    .catch(() => {
      loading.style.display = "none";
      error.style.display = "block";
    });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = allProducts.filter(p =>
        (p.title || "").toLowerCase().includes(searchTerm) ||
        (p.category || "").toLowerCase().includes(searchTerm)
      );
      displayProducts(filtered, grid);
    });
  }
}

// Display products
function displayProducts(products, grid) {
  grid.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-link">
        <img data-src="${product.image}" alt="${product.title}" class="lazy-img">
        <h3>${product.title}</h3>
      </a>
      <p>$${product.price}</p>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
  initLazyLoading();
}

// Add to cart
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const card = e.target.closest(".product-card");
    const name = card.querySelector("h3").textContent;
    const price = card.querySelector("p").textContent;
    const image = card.querySelector("img").src;

    const product = { name, price, image, quantity: 1 };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item.name === product.name);

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
      setTimeout(() => message.classList.remove("show"), 2000);
    }
  }
});

// Render Cart
function renderCart(cartContainer) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ✅ Sanitize prices & quantities
  cart = cart.map(item => ({
    ...item,
    price: typeof item.price === "string"
      ? parseFloat(item.price.replace(/[^0-9.]/g, "")) 
      : parseFloat(item.price),
    quantity: parseInt(item.quantity) || 1
  }));

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    updateCartCount();
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="100" />
      <div class="cart-details">
        <h3>${item.name}</h3>
        <p>Price: ₹${item.price.toFixed(2)}</p>
        <div class="qty-controls">
          <button class="qty-btn decrease" data-index="${index}">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="qty-btn increase" data-index="${index}">+</button>
        </div>
        <p class="item-total">Item Total: ₹${itemTotal.toFixed(2)}</p>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });

  const totalDiv = document.createElement("div");
  totalDiv.id = "total-price";
  totalDiv.innerHTML = `<h3>Total: ₹${total.toFixed(2)}</h3>`;
  cartContainer.appendChild(totalDiv);

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.onclick = () => {
      window.location.href = "checkout.html";
    };
  }

  // ✅ Update cart item actions
  cartContainer.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    if (e.target.classList.contains("increase")) {
      cart[index].quantity++;
    } else if (e.target.classList.contains("decrease")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      }
    } else if (e.target.classList.contains("remove-btn")) {
      cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart(cartContainer);
    updateCartCount();
  });

  updateCartCount();
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countSpan = document.querySelector(".cart-count") || document.getElementById("cart-count");
  if (countSpan) {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countSpan.textContent = totalItems;
  }
}

// Lazy load
function initLazyLoading() {
  const lazyImages = document.querySelectorAll(".lazy-img");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy-img");
          obs.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => img.src = img.dataset.src);
  }
}
