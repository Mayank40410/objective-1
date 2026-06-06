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

/* Modal Controls */

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

/* Register */

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

/* Login */

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

/* Logout */

function logoutUser() {
  localStorage.removeItem("jwtToken");
  alert("Logout Successful ✅");
}

/* Auth Check */

function checkAuthentication() {
  const token = localStorage.getItem("jwtToken");

  if (token) {
    console.log("JWT Active");
  } else {
    console.log("No Login Session");
  }
}

checkAuthentication();

/* Project API */

async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/api/projects`);
  return response.json();
}

async function createProject(projectName) {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      projectName
    })
  });

  return response.json();
}

/* Chat API */

async function askQuestion(message) {
  const response = await fetch(`${API_BASE_URL}/api/chat/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message
    })
  });

  return response.json();
}

/* Button Effects */

document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.03)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});

/* OAuth Placeholder */

function googleLogin() {
  alert("Google OAuth setup pending");
}

function githubLogin() {
  alert("GitHub OAuth setup pending");
}