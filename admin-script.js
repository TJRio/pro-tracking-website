// This event listener waits for the entire HTML page to be loaded before running the code.
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');

    // This is the URL for the Google Apps Script Web App you deployed.
    // !!! --- IMPORTANT: PASTE YOUR WEB APP URL HERE --- !!!
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbzJv9ZKGeKXCkBdou9QEE3ZL4mhr3_n-oi1xlVThEdKJ2trFEMsvMb5Sai2oRbwPEu0pQ/exec';

    // Listen for when the user clicks the "Login" button (submits the form).
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the page from refreshing

        // 1. Show a loading state to the user.
        loginButton.disabled = true;
        loginButton.textContent = 'Verifying...';
        responseMessage.textContent = ''; // Clear previous messages

        // 2. Prepare the data to be sent.
        const loginData = {
            action: 'login', // This tells our Google Script what to do.
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // 3. Send the data to our Google Apps Script.
        fetch(webAppUrl, {
            method: 'POST',
            mode: 'cors', // CORS is required to read the response from a different domain.
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json()) // Get the JSON response from the script.
        .then(data => {
            // 4. Handle the response from the script.
            if (data.result === 'success') {
                responseMessage.className = 'alert alert-success';
                responseMessage.textContent = 'Login Successful! Loading dashboard...';
                // In the next step, we will hide the login form and show the dashboard here.
            } else {
                responseMessage.className = 'alert alert-danger';
                responseMessage.textContent = data.message; // Show the error message (e.g., "Invalid credentials.")
            }
        })
        .catch(error => {
            // Handle network errors.
            responseMessage.className = 'alert alert-danger';
            responseMessage.textContent = 'A network or script error occurred. Please try again.';
            console.error('Error:', error);
        })
        .finally(() => {
            // 5. Reset the login button so the user can try again if needed.
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        });
    });
});