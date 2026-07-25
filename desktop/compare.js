const fallbackProducts = {
    1: {
        id: 1,
        code: 'ZMW29999.12',
        name: 'Apple iPhone 15 Pro Max 256GB',
        description: 'Latest iPhone with 256GB storage.',
        image: 'iphones.png',
        rating: '★★★★★'
    },
    2: {
        id: 2,
        code: 'ZMW4331.45',
        name: 'G-Shock',
        description: 'Shock-resistant watch for daily wear.',
        image: 'GSHOCK.png',
        rating: '★★★★★'
    },
    3: {
        id: 3,
        code: 'ZMW6336.38',
        name: 'CAT S62 Smartphone',
        description: 'Rugged smartphone with reliable performance.',
        image: 'CATS62.png',
        rating: '★★★★★'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const compareList = document.getElementById('compare-list');
    const clearCompareBtn = document.getElementById('clear-compare-btn');

    function updateCounts() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        document.getElementById('cart-count').textContent = `Cart (${cart.length})`;
        document.getElementById('wishlist-count').textContent = `Wishlist (${wishlist.length})`;
        if (window.compareShared) {
            window.compareShared.updateCompareCount();
        }
    }

    function getComparableProduct(id) {
        const items = window.compareShared ? window.compareShared.getCompareItems() : {};
        return items[id] || fallbackProducts[id] || {
            id,
            name: `Product #${id}`,
            code: '',
            description: 'No saved product details available.',
            image: '',
            rating: ''
        };
    }

    function renderCompareList() {
        const ids = window.compareShared ? window.compareShared.getCompareIds() : [];
        compareList.innerHTML = '';

        if (!ids.length) {
            compareList.innerHTML = '<p>No products in compare list yet.</p>';
            return;
        }

        ids.forEach((id) => {
            const product = getComparableProduct(id);
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.maxWidth = '320px';
            card.style.display = 'inline-block';
            card.style.verticalAlign = 'top';
            card.style.margin = '10px';

            card.innerHTML = `
                <a href="${product.url || `product.html?id=${id}`}">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
                    <h3>${product.code || ''}</h3>
                    <p>${product.name}</p>
                    <div class="rating">${product.rating || ''}</div>
                </a>
                <p style="padding: 0 10px 10px; color: #666;">${product.description || ''}</p>
                <div class="product-actions">
                    <button type="button" class="remove-compare-btn" data-product-id="${id}">Remove</button>
                </div>
            `;

            compareList.appendChild(card);
        });
    }

    compareList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('.remove-compare-btn');
        if (!removeBtn) {
            return;
        }

        const productId = Number(removeBtn.getAttribute('data-product-id'));
        if (!Number.isInteger(productId) || !window.compareShared) {
            return;
        }

        window.compareShared.removeFromCompare(productId);
        updateCounts();
        renderCompareList();
    });

    clearCompareBtn.addEventListener('click', () => {
        if (!window.compareShared) {
            return;
        }
        window.compareShared.clearCompare();
        updateCounts();
        renderCompareList();
    });

    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value.trim();
        if (searchTerm) {
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });

    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        alert('Thank you for subscribing!');
        e.target.reset();
    });

    updateCounts();
    renderCompareList();
});
