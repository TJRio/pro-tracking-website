document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');
    const hiddenIframe = document.getElementById('hidden_iframe');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');

    let formSubmitTimeout;

    // Listen for when the user clicks the "Login" button.
    loginForm.addEventListener('submit', () => {
        loginButton.disabled = true;
        loginButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Verifying...`;
        responseMessage.className = '';
        responseMessage.textContent = '';

        // Set a timeout. If the iframe doesn't successfully load (redirect)
        // within 15 seconds, we know the login failed.
        formSubmitTimeout = setTimeout(() => {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = 'Login failed. Please check your credentials and try again.';
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }, 15000);
    });

    // Listen for when the hidden iframe has finished loading its content.
    // This will now ONLY fire if the Google Script performs a successful redirect.
    hiddenIframe.addEventListener('load', () => {
        // Since a load event can only happen on success, we don't need a gatekeeper.
        // We can immediately proceed.
        clearTimeout(formSubmitTimeout); // Stop the failure timeout.

        responseMessage.className = 'alert alert-success mt-3';
        responseMessage.textContent = 'Login Successful! Loading dashboard...';

        // Switch panels.
        setTimeout(() => {
            loginSection.classList.add('d-none');
            updateSection.classList.remove('d-none');
        }, 1000);
    });
});