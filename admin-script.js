// This is the complete, final, and correct admin-script.js using the robust fetch method.

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
        e.preventDefault(); // Stop the form from causing a page reload

        // --- 1. SET LOADING STATE ---
        loginButton.disabled = true;
        loginButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Verifying...
        `;
        loginResponseMessage.className = '';
        loginResponseMessage.textContent = '';

        // --- 2. PREPARE DATA ---
        const loginData = {
            action: 'login',
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // --- 3. SEND REQUEST ---
        fetch(webAppUrl, {
            method: 'POST',
            mode: 'cors', // Essential for reading the response
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            // --- 4. HANDLE SUCCESS/ERROR RESPONSE from our script ---
            if (data.result === 'success') {
                loginResponseMessage.className = 'alert alert-success mt-3';
                loginResponseMessage.textContent = data.message; // "Login successful."

                // Switch to the update panel after a short delay
                setTimeout(() => {
                    loginSection.classList.add('d-none');
                    updateSection.classList.remove('d-none');
                }, 1000);

            } else {
                // Handle logical errors from our script (e.g., wrong password)
                throw new Error(data.message || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            // --- 5. HANDLE ANY FAILURE (Network error or logical error) ---
            loginResponseMessage.className = 'alert alert-danger mt-3';
            loginResponseMessage.textContent = error.message;
            
            // --- RESET BUTTON STATE ON FAILURE ---
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        });
    });
});