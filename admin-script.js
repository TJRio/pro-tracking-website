document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');
    const hiddenIframe = document.getElementById('hidden_iframe');
    const loginSection = document.getElementById('loginSection');
    const updateSection = document.getElementById('updateSection');
    let formSubmitTimeout;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission for debugging
        loginButton.disabled = true;
        loginButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...`;
        responseMessage.className = '';
        responseMessage.textContent = '';

        // Simulate form submission
        const formData = new FormData(loginForm);
        fetch(loginForm.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Temporary for testing
        }).then(response => response.text())
          .then(text => {
              clearTimeout(formSubmitTimeout);
              try {
                  const response = JSON.parse(text);
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
                  }
              } catch (error) {
                  responseMessage.className = 'alert alert-danger mt-3';
                  responseMessage.textContent = 'An error occurred. Please try again. Response: ' + text;
              }
              loginButton.disabled = false;
              loginButton.innerHTML = 'Login';
          }).catch(error => {
              clearTimeout(formSubmitTimeout);
              responseMessage.className = 'alert alert-danger mt-3';
              responseMessage.textContent = 'Network error. Please try again.';
              loginButton.disabled = false;
              loginButton.innerHTML = 'Login';
          });

        formSubmitTimeout = setTimeout(() => {
            responseMessage.className = 'alert alert-danger mt-3';
            responseMessage.textContent = 'Request timed out. Please try again.';
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }, 15000);
    });

    // Remove iframe load event listener since we're using fetch
});