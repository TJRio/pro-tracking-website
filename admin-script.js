document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');

    let failureTimeout;

    // --- LOGIN FORM SUBMISSION ---
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission action
        loginButton.disabled = true;
        loginButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Verifying...`;
        responseMessage.className = '';
        responseMessage.textContent = '';

        // Set a timeout. If we don't receive a "login_success" message
        // from the iframe within 15 seconds, the login has failed.
        failureTimeout = setTimeout(() => {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = 'Login failed. Please check your credentials and try again.';
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }, 15000);

        // Submit login script
        loginForm.submit();
    });

    // --- MESSAGE EVENT LISTENER ---
    window.addEventListener('message', (event) => {
        if (event.data === 'login_success') {
            // --- SUCCESS CASE ---
            clearTimeout(failureTimeout); // Stop the failure timeout.

            responseMessage.className = 'alert alert-success mt-3';
            responseMessage.textContent = 'Login Successful! Loading dashboard...';

            // Switch panels.
            setTimeout(() => {
                loginSection.classList.add('d-none');
                updateSection.classList.remove('d-none');
            }, 1000);
        }
    });
});