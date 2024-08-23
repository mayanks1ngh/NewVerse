document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token) {
        // If no token is found, redirect to login page
        window.location.href = 'login.html';
        return;
    }

    // If token exists, display username
    if (username) {
        document.getElementById('usernameDisplay').innerText = `Hello, ${username}!`;
    } else {
        document.getElementById('usernameDisplay').innerText = 'Welcome, Guest!';
    }
});
