// Popup Controls
function openLogin() {
  loginPopup.style.display = "flex";
}

function closeLogin() {
  loginPopup.style.display = "none";
}

function openRegister() {
  registerPopup.style.display = "flex";
}

function closeRegister() {
  registerPopup.style.display = "none";
}

// Reusable Toast Function
function showToast(message, type = "success") {
  toast.innerHTML = message;

  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Email Validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// REGISTER FUNCTION (Improved)
async function register() {

  const name = rname.value.trim();
  const email = remail.value.trim();
  const password = rpassword.value.trim();

  // Frontend Validation
  if (!name || !email || !password) {
    showToast("All fields are required", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("Enter a valid email", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }

  const data = { name, email, password };

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.status === "ok") {
      showToast("Registered Successfully 🎉", "success");
      closeRegister();
    } else {
      showToast(result.message || "Registration failed", "error");
    }

  } catch (err) {
    showToast("Server error. Try again later", "error");
  }
}

// LOGIN FUNCTION (Improved)
async function login() {

  const email = lemail.value.trim();
  const password = lpassword.value.trim();

  if (!email || !password) {
    showToast("Please enter email and password", "error");
    return;
  }

  const data = { email, password };

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.status === "ok") {

      localStorage.setItem("user",
        JSON.stringify(result.user));

      showToast("Login Successful 🚀", "success");

      setTimeout(() => {
        location.href = "dashboard.html";
      }, 1000);

    } else {
      showToast(result.message || "Invalid Login", "error");
    }

  } catch (err) {
    showToast("Unable to connect to server", "error");
  }
}

