document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const chevronIcon = menuButton.querySelector('.chevron-icon');

    menuButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
        chevronIcon.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('active');
            chevronIcon.classList.remove('active');
        }
    });
});