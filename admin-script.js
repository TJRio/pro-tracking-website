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
    });

    // This event fires whenever the iframe finishes loading content.
    hiddenIframe.addEventListener('load', () => {
        // Ignore the initial "phantom load" of the page.
        if (!hasFormBeenSubmitted) {
            return;
        }

        try {
            // --- THE KEY LOGIC ---
            // Try to read the content of the iframe.
            const iframeContent = hiddenIframe.contentDocument.body.textContent;

            if (iframeContent.includes("Success")) {
                // --- SUCCESS CASE ---
                responseMessage.className = 'alert alert-success mt-3';
                responseMessage.textContent = 'Login Successful! Loading dashboard...';
                setTimeout(() => {
                    loginSection.classList.add('d-none');
                    updateSection.classList.remove('d-none');
                }, 1000);

            } else {
                // --- FAILURE CASE ---
                // If the content is "Failure" or anything else, show an error.
                throw new Error("Login failed. Please check your credentials.");
            }
        } catch (e) {
            // This catch block handles both thrown errors and security errors if the iframe redirect fails.
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = "Login failed. Please check your credentials and try again.";
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
            hasFormBeenSubmitted = false; // Reset the gate
        }
    });
});