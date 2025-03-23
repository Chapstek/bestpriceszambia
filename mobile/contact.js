document.addEventListener('DOMContentLoaded', () => {
    // Search Functionality
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = document.getElementById('search-input').value;
            if (searchTerm) {
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            if (name && email && message) {
                // Simulate form submission (in a real app, send to a server)
                console.log('Contact Form Submission:', { name, email, message });
                localStorage.setItem('contactSubmission', JSON.stringify({ name, email, message }));
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }
        });
    }

    // Update Counts
    updateCounts();

    // Highlight Current Page in Top Navigation
    const topNavLinks = document.querySelectorAll('nav a');
    if (topNavLinks) {
        topNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const navHome = document.getElementById('nav-home');
        if (navHome) navHome.classList.add('active');
    }

    // Highlight Current Page in Bottom Navigation
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
    if (bottomNavLinks) {
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const bottomNavHome = document.getElementById('bottom-nav-home');
        if (bottomNavHome) bottomNavHome.classList.add('active');
    }

    // Breadcrumb Navigation
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const currentPage = window.location.pathname.split('/').pop();
            let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];
            if (!navHistory.some(item => item.url === currentPage)) {
                navHistory.push({ url: currentPage, title: 'Contact Us' });
            }
            if (navHistory.length > 5) {
                navHistory = navHistory.slice(-5);
            }
            sessionStorage.setItem('navHistory', JSON.stringify(navHistory));
            let breadcrumbHTML = '';
            navHistory.forEach((item, index) => {
                if (index < navHistory.length - 1) {
                    breadcrumbHTML += `<a href="${item.url}">${item.title}</a><span class="separator">></span>`;
                } else {
                    breadcrumbHTML += `<span>${item.title}</span>`;
                }
            });
            breadcrumb.innerHTML = breadcrumbHTML;
        }
    }

    updateBreadcrumb();
});