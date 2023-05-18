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
        localStorage.setItem('token', token);

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        const protectedResponse = await fetch('/protected', {
            method: 'GET',
            headers,
        });

        if (protectedResponse.ok) {
            const protectedData = await protectedResponse.json();
            console.log(protectedData);
        } else {
            const errorData = await protectedResponse.json();
            console.error(errorData.error);
        }
        // Redirect to a protected page or perform any desired action
    } else {
        const errorData = await response.json();
        // Handle login error
        console.error(errorData.error);
    }
});