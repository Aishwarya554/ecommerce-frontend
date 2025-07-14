document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // 🔁 Toggle between forms
  loginBtn.addEventListener("click", () => {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  });

  signupBtn.addEventListener("click", () => {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  });

  // ✅ SIGNUP with Firebase
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("Password must be 8+ chars, contain uppercase, lowercase, number.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert("✅ Signup successful!");
        signupForm.reset();
        loginBtn.click(); // Switch to login form
      })
      .catch((error) => {
        alert("❌ Signup Error: " + error.message);
      });
  });

  // ✅ LOGIN with Firebase
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("✅ Login successful!");
        window.location.href = "index.html"; // ✅ Redirect to home/dashboard
      })
      .catch((error) => {
        alert("❌ Login failed: " + error.message);
      });
  });

  // ✅ Authentication State Check
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      logoutBtn.style.display = "block";
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
    } else {
      logoutBtn.style.display = "none";
      loginBtn.style.display = "inline-block";
      signupBtn.style.display = "inline-block";

      // Optional: redirect to login if not already there
      if (!window.location.pathname.includes("auth.html")) {
        window.location.href = "auth.html";
      }
    }
  });

  // ✅ LOGOUT
  logoutBtn.addEventListener("click", () => {
    firebase.auth().signOut()
      .then(() => {
        alert("✅ Logged out!");
        window.location.href = "auth.html";
      })
      .catch((error) => {
        alert("❌ Logout error: " + error.message);
      });
  });
});
