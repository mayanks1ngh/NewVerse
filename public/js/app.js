const loggedInUserId = localStorage.getItem('userId'); // Assuming you store the user ID in local storage
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5500/posts')
    .then(response => response.json())
    .then(posts => {
        const blogsContainer = document.getElementById('blogs');
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <small>By ${post.author.name} on ${new Date(post.createdAt).toLocaleString()}</small>
                <p>${post.content}</p>
                ${post.image ? `<img src="/public/backend/${post.image}" alt="Post Image">`:''}

                <div class="actions">
                    <i class="fas fa-edit" onclick="editPost('${post._id}')"></i>
                    <i class="fas fa-trash-alt" onclick="deletePost('${post._id}')"></i>
                </div>
            `;
            blogsContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
});

function editPost(id) {
    window.location.href = `/public/edit-blog.html?id=${id}`;
}

function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`http://localhost:5500/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Post deleted successfully');
                window.location.reload();
            } else {
                alert('Error deleting post: ' + data.message);
            }
        })
        .catch
        {
            console.error('Error occurred while deleting post:', error); // Log the error to see more details
            res.status(500).json({ message: 'Failed to delete post', error: error.message });
        }
    }
}

        // Fetch blogs when the page loads
       // document.addEventListener('DOMContentLoaded', fetchBlogs);
