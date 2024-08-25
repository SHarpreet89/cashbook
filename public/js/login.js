console.log('login.js file loaded');

const loginFormHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#login-password').value.trim();

    // Debug statement to log form inputs
    console.log('Login form values:', { username, password });

    if (username && password) {
        try {
            console.log('Submitting login request:', { username, password });

            const response = await fetch('/api/user/login', {
                method: 'POST',
                body: JSON.stringify({ email: username, password }), // Adjusted to match expected field names
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('Login response:', response);

            if (response.ok) {
                console.log('Login successful, redirecting to dashboard...');
                document.location.replace('/dashboard');
            } else {
                console.log('Login failed:', response.statusText);
                alert(response.statusText);
            }
        } catch (error) {
            console.error('Error occurred during login:', error);
        }
    } else {
        console.log('Login form validation failed. Username or password missing.');
    }
};

const signupFormHandler = async (event) => {
    event.preventDefault();

    const email = document.querySelector('#signup-email').value.trim();
    const password = document.querySelector('#signup-password').value.trim();
    const firstName = document.querySelector('#signup-first-name').value.trim();
    const lastName = document.querySelector('#signup-last-name').value.trim();

    // Debug statement to log form inputs
    console.log('Signup form values:', { email, password, firstName, lastName });

    if (email && password && firstName && lastName) {
        try {
            console.log('Submitting signup request:', { email, password, firstName, lastName });

            const response = await fetch('/api/user', {
                method: 'POST',
                body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('Signup response:', response);

            if (response.ok) {
                console.log('Signup successful, redirecting to dashboard...');
                document.location.replace('/dashboard');
            } else {
                console.log('Signup failed:', response.statusText);
                alert(response.statusText);
            }
        } catch (error) {
            console.error('Error occurred during signup:', error);
        }
    } else {
        console.log('Signup form validation failed. Missing required fields.');
    }
};

// Attach event listeners
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
