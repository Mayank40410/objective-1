console.log("Secure Authentication Dashboard Loaded Successfully");

function showMessage() {
  alert("Welcome to the Secure Authentication Frontend Design 🚀");
}

/* =========================
   Feature Card Hover Effect
========================= */

const cards = document.querySelectorAll('.feature-card');

cards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px) scale(1.03)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
  });
});

/* =========================
   Modal Functions
========================= */

function openLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function openRegisterModal() {
  document.getElementById('registerModal').style.display = 'flex';
}

function closeRegisterModal() {
  document.getElementById('registerModal').style.display = 'none';
}

/* =========================
   OAuth Placeholder Buttons
========================= */

function googleLogin() {
  alert('Google OAuth Login Integration Ready 🚀');
}

function githubLogin() {
  alert('GitHub OAuth Login Integration Ready 🚀');
}

/* =========================
   Register Form
========================= */

const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const registerMessage = document.getElementById('registerMessage');

    const userData = {
      name,
      email,
      password
    };

    localStorage.setItem('registeredUser', JSON.stringify(userData));

    registerMessage.style.color = '#22c55e';
    registerMessage.textContent = 'Registration Successful ✅';

    console.log('Registered User:', userData);

    setTimeout(() => {
      closeRegisterModal();
    }, 1500);
  });
}

/* =========================
   JWT Token Generator
========================= */

async function generateJWTToken(email) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    email: email,
    role: 'admin',
    loginTime: new Date().toISOString()
  };

  const secretKey = 'secureFrontendSecretKey';

  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));

  const signature = btoa(
    base64Header + '.' + base64Payload + '.' + secretKey
  );

  return `${base64Header}.${base64Payload}.${signature}`;
}

/* =========================
   Login Form
========================= */

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('loginMessage');

    if (email === 'admin@example.com' && password === '123456') {

      const token = await generateJWTToken(email);

      localStorage.setItem('jwtToken', token);

      message.style.color = '#22c55e';
      message.textContent = 'JWT Login Successful ✅';

      console.log('Generated JWT Token:', token);

      setTimeout(() => {
        closeLoginModal();
        alert('Protected Session Started 🚀');
      }, 1200);

    } else {

      message.style.color = '#ef4444';
      message.textContent = 'Invalid Email or Password ❌';

    }
  });
}

/* =========================
   Authentication Checker
========================= */

function checkAuthentication() {
  const token = localStorage.getItem('jwtToken');

  if (token) {
    console.log('Authenticated User Token Found');
  } else {
    console.log('No Active JWT Session');
  }
}

/* =========================
   Logout Function
========================= */

function logoutUser() {
  localStorage.removeItem('jwtToken');
  alert('Logged Out Successfully');
}

checkAuthentication();

/* =========================
   Navbar Scroll Effect
========================= */

window.addEventListener('scroll', () => {

  const navbar = document.querySelector('.navbar');

  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(15, 23, 42, 0.9)';
    navbar.style.padding = '15px 20px';
    navbar.style.borderRadius = '15px';
  } else {
    navbar.style.background = 'transparent';
  }

});