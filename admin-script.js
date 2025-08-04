// --- CONFIGURATION ---
// !!! PASTE YOUR FINAL, PERMANENT GOOGLE SCRIPT WEB APP URL HERE !!!
const webAppUrl = 'https://script.google.com/macros/s/AKfycbzJv9ZKGeKXCkBdou9QEE3ZL4mhr3_n-oi1xlVThEdKJ2trFEMsvMb5Sai2oRbwPEu0pQ/exec';

// --- ELEMENT SELECTORS ---
const loginSection = document.getElementById('loginSection');
const updateSection = document.getElementById('updateSection');
const loginForm = document.getElementById('loginForm');
const adminForm = document.getElementById('adminForm');
const loginButton = document.getElementById('loginButton');
const updateButton = document.getElementById('updateButton');
const loginResponseMessage = document.getElementById('loginResponseMessage');
const updateResponseMessage = document.getElementById('updateResponseMessage');

// --- LOGIN LOGIC ---
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    setLoadingState(loginButton, true, 'Verifying...');
    loginResponseMessage.className = '';
    loginResponseMessage.textContent = '';

    const loginData = {
        action: 'login',
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    fetch(webAppUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            setResponseMessage(loginResponseMessage, 'success', 'Login Successful! Loading dashboard...');
            // We will add the logic to show the dashboard next
        } else {
            setResponseMessage(loginResponseMessage, 'danger', data.message || 'Invalid credentials.');
        }
    })
    .catch(error => setResponseMessage(loginResponseMessage, 'danger', 'A network or script error occurred. Please try again.'))
    .finally(() => setLoadingState(loginButton, false, 'Login'));
});

// --- UPDATE LOGIC (to be built) ---
// adminForm.addEventListener(...)

// --- HELPER FUNCTIONS ---
function setLoadingState(button, isLoading, loadingText) {
    const originalText = button.getAttribute('data-original-text') || button.textContent;
    if (!button.getAttribute('data-original-text')) {
        button.setAttribute('data-original-text', originalText);
    }
    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : originalText;
}

function setResponseMessage(element, type, message) {
    element.className = `alert alert-${type} mt-3`;
    element.textContent = message;
}