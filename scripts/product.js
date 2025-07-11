// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id")); // e.g., ?id=0

// Fetch local JSON file
fetch("/products.json")
  .then(res => res.json())
  .then(products => {
    const product = products[productId];

    if (!product) {
      document.querySelector(".product-info").innerHTML = "<p>Product not found.</p>";
      return;
    }

    // ✅ Quantity selector logic
    const price = parseFloat(product.price.replace("$", "")) || 0;
    let quantity = 1;
    const maxQuantity = 10;

    const quantityInput = document.getElementById("quantity");
    const totalPriceDisplay = document.getElementById("total-price");

    function updateTotalPrice() {
      totalPriceDisplay.textContent = `Total: $${(price * quantity).toFixed(2)}`;
      document.getElementById("product-price").textContent = `$${(price * quantity).toFixed(2)}`;
    }

    document.getElementById("increase").addEventListener("click", () => {
      if (quantity < maxQuantity) {
        quantity++;
        quantityInput.value = quantity;
        updateTotalPrice();
      }
    });

    document.getElementById("decrease").addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
        updateTotalPrice();
      }
    });

    // Fill product details
    document.getElementById("product-img").src = product.image;
    document.getElementById("product-img").alt = product.name;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent =
      "This is a premium, high-quality product picked just for you!";
    quantityInput.value = quantity;
    updateTotalPrice(); // ✅ Initial total price

    // ✅ Add to cart with size, color, and quantity
   document.getElementById("add-to-cart-btn").addEventListener("click", () => {
  const selectedSize = document.getElementById("size").value;
  const selectedColor = document.getElementById("color").value;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productWithDetails = {
    ...product,
    selectedSize,
    selectedColor,
    quantity
  };

  // Check if the product with same ID and variations already exists
  const existingIndex = cart.findIndex(item =>
    item.id === product.id &&
    item.selectedSize === selectedSize &&
    item.selectedColor === selectedColor
  );

  if (existingIndex !== -1) {
    // ✅ Update quantity instead of adding duplicate
    cart[existingIndex].quantity += quantity;
  } else {
    // ✅ Add new product
    cart.push(productWithDetails);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  alert(`✅ Added to cart:\n${product.name}\nSize: ${selectedSize}\nColor: ${selectedColor}\nQuantity: ${quantity}`);
});

  })
  .catch((err) => {
    console.error("Error loading product:", err);
    document.querySelector(".product-info").innerHTML =
      "<p>Error loading product details.</p>";
  });

// ✅ Cart count update
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countSpan = document.querySelector(".cart-count");
  if (countSpan) {
    countSpan.textContent = cart.length;
  }
}

updateCartCount();
