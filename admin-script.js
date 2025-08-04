document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');
    const hiddenIframe = document.getElementById('hidden_iframe');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');

    let hasFormBeenSubmitted = false;

    loginForm.addEventListener('submit', () => {
        hasFormBeenSubmitted = true;
        loginButton.disabled = true;
        loginButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Verifying...`;
        responseMessage.className = '';
        responseMessage.textContent = '';

        setTimeout(() => {
            if (hasFormBeenSubmitted) { // Check if we are still waiting
                responseMessage.className = 'alert alert-danger mt-3';
                responseMessage.textContent = 'Login failed. Please check your credentials and try again.';
                loginButton.disabled = false;
                loginButton.innerHTML = 'Login';
                hasFormBeenSubmitted = false; // Reset the gate
            }
        }, 15000);
    });

    hiddenIframe.addEventListener('load', () => {
        if (!hasFormBeenSubmitted) {
            return;
        }

        clearTimeout(); // This is not needed, the logic is simpler
        responseMessage.className = 'alert alert-success mt-3';
        responseMessage.textContent = 'Login Successful! Loading dashboard...';

        setTimeout(() => {
            loginSection.classList.add('d-none');
            updateSection.classList.remove('d-none');
        }, 1000);
        
        hasFormBeenSubmitted = false; // Reset the gate after success
    });
});