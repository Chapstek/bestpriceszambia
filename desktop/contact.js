document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('search-input');
            const searchTerm = searchInput ? searchInput.value : '';
            if (searchTerm) {
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    updateCounts();

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailField = document.getElementById('newsletter-email');
            const email = emailField ? emailField.value : '';
            if (!email) return;
            const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            alert('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameField = document.getElementById('contact-name');
            const emailField = document.getElementById('contact-email');
            const messageField = document.getElementById('contact-message');
            const name = nameField ? nameField.value : '';
            const email = emailField ? emailField.value : '';
            const message = messageField ? messageField.value : '';

            if (name && email && message) {
                localStorage.setItem('contactSubmission', JSON.stringify({ name, email, message }));
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }
        });
    }

    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = '<a href="index.html">Home</a><span class="separator">></span><span>Contact</span>';
    }
});

function updateCounts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const compare = JSON.parse(localStorage.getItem('compare')) || [];
    document.getElementById('cart-count').textContent = `Cart (${cart.length})`;
    document.getElementById('wishlist-count').textContent = `Wishlist (${wishlist.length})`;
    document.getElementById('compare-count').textContent = `Compare (${compare.length})`;
}
