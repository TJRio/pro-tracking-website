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

        // Set a timeout for fallback in case the server doesn't respond
        formSubmitTimeout = setTimeout(() => {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = 'Request timed out. Please try again.';
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }, 15000);
    });

    hiddenIframe.addEventListener('load', () => {
        clearTimeout(formSubmitTimeout);

        try {
            // Access the iframe's content to read the server response
            const responseText = hiddenIframe.contentDocument.body.textContent;
            const response = JSON.parse(responseText);

            if (response.status === 'success') {
                responseMessage.className = 'alert alert-success mt-3';
                responseMessage.textContent = 'Login Successful! Loading dashboard...';
                setTimeout(() => {
                    loginSection.classList.add('d-none');
                    updateSection.classList.remove('d-none');
                }, 1000);
            } else {
                responseMessage.className = 'alert alert-danger mt-3';
                responseMessage.textContent = response.message || 'Login failed. Please check your credentials and try again.';
                loginButton.disabled = false;
                loginButton.innerHTML = 'Login';
            }
        } catch (error) {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = 'An error occurred. Please try again.';
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }
    });
});