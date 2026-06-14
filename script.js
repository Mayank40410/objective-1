console.log("Secure Authentication Dashboard Loaded");

const API_BASE_URL = "https://objective-1-geu2.onrender.com";

function getElement(id) {
  return document.getElementById(id);
}

function showMessage(element, msg, color) {
  if (element) {
    element.style.color = color;
    element.innerText = msg;
  }
}

function openLoginModal() {
  getElement("loginModal").style.display = "flex";
}

function closeLoginModal() {
  getElement("loginModal").style.display = "none";
}

function openRegisterModal() {
  getElement("registerModal").style.display = "flex";
}

function closeRegisterModal() {
  getElement("registerModal").style.display = "none";
}

function showMessageAlert() {
  alert("Welcome to AuthSecure AI Research Workspace 🚀");
}

function googleLogin() {
  alert("Google OAuth setup pending");
}

function githubLogin() {
  alert("GitHub OAuth setup pending");
}

const registerForm = getElement("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = getElement("registerName").value.trim();
    const email = getElement("registerEmail").value.trim();
    const password = getElement("registerPassword").value.trim();
    const message = getElement("registerMessage");

    if (!name || !email || !password) {
      showMessage(message, "Please fill all fields ❌", "red");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(message, "Registration Successful ✅", "#22c55e");
        registerForm.reset();

        setTimeout(() => {
          closeRegisterModal();
          openLoginModal();
        }, 1000);
      } else {
        showMessage(message, data.message || "Registration Failed ❌", "red");
      }
    } catch (error) {
      console.log(error);
      showMessage(message, "Backend Connection Failed ❌", "red");
    }
  });
}

const loginForm = getElement("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = getElement("email").value.trim();
    const password = getElement("password").value.trim();
    const message = getElement("loginMessage");

    if (!email || !password) {
      showMessage(message, "Please enter email and password ❌", "red");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwtToken", data.token);

        showMessage(message, "Login Successful ✅", "#22c55e");

        setTimeout(() => {
          closeLoginModal();
          alert("Protected Session Started 🚀");
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        showMessage(message, data.message || "Invalid Login ❌", "red");
      }
    } catch (error) {
      console.log(error);
      showMessage(message, "Backend Not Connected ❌", "red");
    }
  });
}

function logoutUser() {
  localStorage.removeItem("jwtToken");
  alert("Logout Successful ✅");
}

function checkAuthentication() {
  const token = localStorage.getItem("jwtToken");

  if (token) {
    console.log("JWT Active");
  } else {
    console.log("No Login Session");
  }
}

checkAuthentication();

document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.03)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});

/* Typing Animation */

const words = [
  "Workspace Management",
  "AI Research Dashboard",
  "PDF RAG Assistant",
  "Secure Login System"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const typingText = document.getElementById("typingText");

  if (!typingText) return;

  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingText.textContent = currentWord.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentWord.length + 1) {
    isDeleting = true;

    setTimeout(typeEffect, 1200);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(typeEffect, isDeleting ? 45 : 90);
}

typeEffect();