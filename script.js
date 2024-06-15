document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    const navbarRight = document.querySelector('.navbar-right');
    const searchIconBtn = document.getElementById('search-icon-btn');
    const searchContainer = document.getElementById('search-container');
    const closeBtn = document.getElementById('close-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');

    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
        navbarRight.classList.toggle('active');
    });

    searchIconBtn.addEventListener('click', () => {
        searchContainer.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        searchContainer.style.display = 'none';
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.category-btn.active').classList.remove('active');
            button.classList.add('active');
            // Add logic here to filter news based on the selected category
        });
    });
});
