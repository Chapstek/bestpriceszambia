document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = document.getElementById('search-input').value;
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
            const email = document.getElementById('newsletter-email').value;
            const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            alert('Thank you for subscribing!');
            e.target.reset();
        });
    }

    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        breadcrumb.textContent = '';

        const homeLink = document.createElement('a');
        homeLink.href = 'index.html';
        homeLink.textContent = 'Home';
        breadcrumb.appendChild(homeLink);

        const separator = document.createElement('span');
        separator.className = 'separator';
        separator.textContent = '>';
        breadcrumb.appendChild(separator);

        const current = document.createElement('span');
        current.textContent = 'Privacy Policy';
        breadcrumb.appendChild(current);
    }

    updateBreadcrumb();
});

function updateCounts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const compare = JSON.parse(localStorage.getItem('compare')) || [];
    document.getElementById('cart-count').textContent = `Cart (${cart.length})`;
    document.getElementById('wishlist-count').textContent = `Wishlist (${wishlist.length})`;
    document.getElementById('compare-count').textContent = `Compare (${compare.length})`;
}
