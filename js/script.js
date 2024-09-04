document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Toggle navigation links on small screens
    menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('.about-section, .highlight');

    function onScroll() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                section.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); // Initial check on page load
});

// made with <3 by awiones