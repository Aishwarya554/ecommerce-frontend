document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items-container");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ✅ Sanitize prices and quantities
  cart = cart.map(item => ({
    ...item,
    price: typeof item.price === "string"
      ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
      : parseFloat(item.price),
    quantity: parseInt(item.quantity) || 1
  }));

  function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
  }

  function renderCart() {
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
      const price = parseFloat(item.price.toString().replace(/[^\d.]/g, ""));
      const quantity = parseInt(item.quantity) || 1;
      const itemTotal = price * quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" width="100" />
        <div class="cart-details">
          <h3>${item.name}</h3>
          <p>Price: ₹${price.toFixed(2)}</p>
          <p>Option: ${item.option || "N/A"}</p>
          <div class="qty-controls">
            <button class="qty-btn decrease" data-index="${index}">−</button>
            <span class="qty" id="qty-${index}">${item.quantity}</span>
            <button class="qty-btn increase" data-index="${index}">+</button>
          </div>
          <p class="item-total" id="item-total-${index}">Item Total: ₹${itemTotal.toFixed(2)}</p>
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

    updateCartCount();
  }

  // 🔁 Initial render
  renderCart();

  // 🔁 Handle quantity changes and removal
  cartContainer.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("increase")) {
      cart[index].quantity++;
    }

    if (e.target.classList.contains("decrease")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        return;
      }
    }

    if (e.target.classList.contains("remove-btn")) {
      cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });
});
