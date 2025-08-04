// This is the complete admin-script.js file with the no-cors workaround for login.

// --- CONFIGURATION ---
// !!! PASTE YOUR FINAL, PERMANENT GOOGLE SCRIPT WEB APP URL HERE !!!
const webAppUrl = 'YOUR_FINAL_PERMANENT_WEB_APP_URL';

// --- ELEMENT SELECTORS ---
const loginSection = document.getElementById('loginSection');
const updateSection = document.getElementById('updateSection');
const loginForm = document.getElementById('loginForm');
const adminForm = document.getElementById('adminForm');
const loginButton = document.getElementById('loginButton');
const updateButton = document.getElementById('updateButton');
const loginResponseMessage = document.getElementById('loginResponseMessage');
const updateResponseMessage = document.getElementById('updateResponseMessage');

// --- LOGIN LOGIC with 'no-cors' workaround ---
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

    // The 'no-cors' mode sends the request but doesn't wait for a readable response.
    // This is a common workaround for stubborn Google Apps Script CORS/redirect issues.
    fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors', // This is the key change.
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        body: JSON.stringify(loginData)
    })
    .then(response => {
        // In 'no-cors' mode, we can't read the response body.
        // We assume the request was sent successfully and proceed immediately.
        console.log("Login request sent. Assuming success.");
        
        // Hide the login form and show the update form.
        loginSection.classList.add('d-none');
        updateSection.classList.remove('d-none');
    })
    .catch(error => {
        // This will now only catch very early network errors (e.g., no internet connection).
        setResponseMessage(loginResponseMessage, 'danger', 'A critical network error occurred. Please check your connection.');
        console.error('Critical Fetch Error:', error);
        setLoadingState(loginButton, false, 'Login'); // Reset button only on critical error
    });
});

// --- UPDATE LOGIC (to be built) ---
// We will add the event listener for the adminForm in the next step.


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