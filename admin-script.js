// This is the complete and final admin-script.js, using the GET method.

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    // !!! PASTE YOUR FINAL, STABLE GOOGLE SCRIPT WEB APP URL HERE !!!
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbyyjZrnG1M2IZ7JvJL7EItGRMt9Fbdxo-kyjJ2OmJXUp7_k1s4_eMdbO0SVFBgJc0k6eA/exec';

    // --- ELEMENT SELECTORS ---
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const loginResponseMessage = document.getElementById('responseMessage');

    // --- LOGIN LOGIC ---
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. SET LOADING STATE
        loginButton.disabled = true;
        loginButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...`;
        loginResponseMessage.className = '';
        loginResponseMessage.textContent = '';

        // 2. PREPARE DATA FOR URL PARAMETERS
        const params = new URLSearchParams({
            action: 'login',
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        });
        
        // Construct the full URL with the parameters
        const fullUrl = `${webAppUrl}?${params.toString()}`;

        // 3. SEND GET REQUEST
        fetch(fullUrl) // No method or body needed for GET
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 4. HANDLE RESPONSE
            if (data.result === 'success') {
                loginResponseMessage.className = 'alert alert-success mt-3';
                loginResponseMessage.textContent = data.message;
                setTimeout(() => {
                    loginSection.classList.add('d-none');
                    updateSection.classList.remove('d-none');
                }, 1000);
            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            // 5. HANDLE ANY FAILURE
            loginResponseMessage.className = 'alert alert-danger mt-3';
            loginResponseMessage.textContent = error.message;
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        });
    });
});