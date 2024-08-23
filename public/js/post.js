document.addEventListener('DOMContentLoaded', () => {
    // Ensure that the form is only processed after the DOM is fully loaded
    const postForm = document.getElementById('postForm');
    
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(postForm);
        const title = formData.get('title');
        const content = formData.get('content');
        const image = formData.get('image'); // Image file
        const token = localStorage.getItem('token');
        
        // Client-side validation
        if (!title || !content) {
            alert('Title and content are required.');
            return;
        }

        if (!token) {
            alert('You must be logged in to post a blog.');
            window.location.href = 'login.html'; // Redirect to login if no token is found
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
        
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
        
                if (response.ok) {
                    alert('Blog post created successfully');
                    window.location.href = 'index.html';
                } else {
                    alert(`Error: ${data.message || 'Something went wrong.'}`);
                }
            } else {
                alert('Unexpected response format. Please check the server.');
                console.error('Unexpected response:', await response.text());
            }
        } catch (err) {
            console.error('Error posting blog:', err);
            alert('An error occurred while posting the blog. Please try again.');
        }
        
    });
});
