document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get input values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    // Validate form inputs
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }


    // Clear previous error messages
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // Validation checks
    let isValid = true;

    // Email validation
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email === '') {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }

    // Password validation
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long';
        isValid = false;
    }

    // If validation fails, do not submit the form
    if (!isValid) {
        return;
    }

    // If validation passes, proceed with the form submission
    try {
        const response = await fetch('http://localhost:5500/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
    
        if (!response.ok) {  // Check if the response was successful
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        if (response.status === 200) {
            alert("Login Successful");
            localStorage.setItem('token', data.token); // Store JWT
            localStorage.setItem('username', data.user.name); // Store username
            window.location.href = 'index.html'; // Redirect to the main page
        } else {
            alert("Login Failed");
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred during login. Please try again.');
    }
});
