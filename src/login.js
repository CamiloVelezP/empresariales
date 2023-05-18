document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const { token } = await response.json();
        // Save the token in local storage or as a cookie
        // Redirect to a protected page or perform any desired action
    } else {
        const errorData = await response.json();
        // Handle login error
        console.error(errorData.error);
    }
});