document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');
    const hiddenIframe = document.getElementById('hidden_iframe');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');

    // --- THE "GATEKEEPER" VARIABLE ---
    // This starts as 'false'. We will only set it to 'true' AFTER the user clicks the login button.
    let hasFormBeenSubmitted = false;

    let formSubmitTimeout;

    // --- LOGIN FORM SUBMISSION LOGIC ---
    loginForm.addEventListener('submit', () => {
        // When the user clicks login, we open the gate!
        hasFormBeenSubmitted = true;

        loginButton.disabled = true;
        loginButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...`;
        responseMessage.className = '';
        responseMessage.textContent = '';

        // Set the failure timeout.
        formSubmitTimeout = setTimeout(() => {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = 'Login failed. Please check your credentials and try again.';
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
            hasFormBeenSubmitted = false; // Reset the gate on failure
        }, 15000);
    });

    // --- IFRAME LOAD EVENT LISTENER ---
    hiddenIframe.addEventListener('load', () => {
        // This is the crucial check:
        // ONLY do something if the gate is open (the user has submitted the form).
        if (!hasFormBeenSubmitted) {
            return; // Ignore the initial "phantom load" of the iframe.
        }

        // If we get here, it means a REAL submission was successful.
        clearTimeout(formSubmitTimeout); // Stop the failure timeout.

        responseMessage.className = 'alert alert-success mt-3';
        responseMessage.textContent = 'Login Successful! Loading dashboard...';

        // Switch panels.
        setTimeout(() => {
            loginSection.classList.add('d-none');
            updateSection.classList.remove('d-none');
            // We will build the update form here in the next step.
        }, 1000);
    });
});
