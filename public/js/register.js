document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Retrieve form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Initialize an array to store validation errors
    const errors = [];

    // Name validation: required and at least 2 characters long
    if (name.length < 2) {
        errors.push("Name must be at least 2 characters long.");
    }

    // Email validation: must follow a basic email pattern
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailPattern.test(email)) {
        errors.push("Please enter a valid email address.");
    }

    // Password validation: required and at least 8 characters long
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }

    // Check if there are validation errors
    if (errors.length > 0) {
        // Display errors to the user
        alert("Please fix the following errors:\n" + errors.join("\n"));
        return; // Stop form submission
    }

    try {
        // Send data to the server if validation passes
        const response = await fetch('http://localhost:5500/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            // Optionally, redirect the user to another page, e.g., login page
            window.location.href ='login.html';
        } else {
            const errorText = await response.text(); // Get the server's response as text
            console.error('Error:', errorText);
            alert('An error occurred: ' + errorText);
        } 
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});
