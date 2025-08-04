document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');

    let networkTimeout;

    // --- LOGIN FORM SUBMISSION ---
    loginForm.addEventListener('submit', () => {
        loginButton.disabled = true;
        loginButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Verifying...`;
        responseMessage.className = '';
        responseMessage.textContent = '';

        // The timeout now acts as a failsafe for complete network errors 
        // or if the Apps Script itself crashes before returning anything.
        networkTimeout = setTimeout(() => {
            handleLoginResult(false, 'Network error. Please check your connection and try again.');
        }, 15000); // 15-second failsafe
    });

    // --- MESSAGE EVENT LISTENER ---
    // Listens for the 'login_success' or 'login_failure' message from the iframe.
    window.addEventListener('message', (event) => {
        if (event.data === 'login_success') {
            handleLoginResult(true);
        } else if (event.data === 'login_failure') {
            handleLoginResult(false, 'Login failed. Please check your credentials and try again.');
        }
    });

    // --- FUNCTION TO HANDLE LOGIN RESULT ---
    function handleLoginResult(isSuccess, message) {
        // Clear the network timeout since we received a response.
        clearTimeout(networkTimeout);

        if (isSuccess) {
            responseMessage.className = 'alert alert-success mt-3';
            responseMessage.textContent = 'Login Successful! Loading dashboard...';

            // Switch panels after a short delay
            setTimeout(() => {
                loginSection.classList.add('d-none');
                updateSection.classList.remove('d-none');
            }, 1000);
        } else {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = message;
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }
    }
});