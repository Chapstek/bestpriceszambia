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
        const currentPage = window.location.pathname.split('/').pop();
        let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];

        if (navHistory.length === 0 || navHistory[navHistory.length - 1].url !== currentPage) {
            navHistory = [{ url: 'index.html', title: 'Home' }];
            navHistory.push({ url: currentPage, title: 'About Us' });
        }

        if (navHistory.length > 5) {
            navHistory = navHistory.slice(-5);
        }

        sessionStorage.setItem('navHistory', JSON.stringify(navHistory));

        breadcrumb.textContent = '';
        navHistory.forEach((item, index) => {
            if (index < navHistory.length - 1) {
                const link = document.createElement('a');
                link.href = item.url;
                link.textContent = item.title;
                breadcrumb.appendChild(link);

                const separator = document.createElement('span');
                separator.className = 'separator';
                separator.textContent = '>';
                breadcrumb.appendChild(separator);
            } else {
                const current = document.createElement('span');
                current.textContent = item.title;
                breadcrumb.appendChild(current);
            }
        });
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
