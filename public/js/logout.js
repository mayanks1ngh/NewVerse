// logout.js
document.getElementById('username').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:5500/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // if using JWT
            }
        });

        if (response.ok) {
            localStorage.removeItem('token'); // Clear JWT from client-side storage
            alert('Logged out successfully');
            window.location.href = 'login.html'; // Redirect to login or home page
        } else {
            alert('Logout failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
