// This script uses the hidden iframe method, which is a robust workaround for Google Apps Script fetch/CORS issues.

document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTORS ---
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');
    const hiddenIframe = document.getElementById('hidden_iframe');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');

    // Variable to hold our timeout function
    let formSubmitTimeout;

    // --- LOGIN FORM SUBMISSION LOGIC ---
    // This event fires when the user clicks the "Login" button.
    loginForm.addEventListener('submit', () => {
        // 1. Show a loading state to the user.
        loginButton.disabled = true;
        loginButton.textContent = 'Verifying...';
        responseMessage.className = ''; // Clear previous message styles
        responseMessage.textContent = ''; // Clear previous message text

        // 2. Set a timeout as a "failure" condition.
        // If the iframe doesn't load within 15 seconds, it means the login was incorrect
        // because the Google Script didn't return a "success" response.
        formSubmitTimeout = setTimeout(() => {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = 'Login failed. Please check your credentials and try again.';
            
            // Reset the button so the user can try again.
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }, 15000); // 15 seconds
    });

    // --- IFRAME LOAD EVENT LISTENER ---
    // This event fires ONLY if the Google Script runs successfully and returns a response.
    hiddenIframe.addEventListener('load', () => {
        // 1. If the iframe loads, we know the login was successful. Clear the failure timeout.
        clearTimeout(formSubmitTimeout);

        // 2. Show a success message to the user.
        responseMessage.className = 'alert alert-success mt-3';
        responseMessage.textContent = 'Login Successful! Loading dashboard...';

        // 3. Hide the login form and show the (currently empty) update panel after a short delay.
        setTimeout(() => {
            loginSection.classList.add('d-none');
            updateSection.classList.remove('d-none');
            
            // In the next step of our project, we will add the code here
            // to build the actual package update form inside the 'updateSection'.
            
        }, 1000); // Wait 1 second for the user to read the success message.
    });
});