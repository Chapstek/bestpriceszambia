// data.js
// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999", name: "Apple iPhone 15 Pro Max 256GB", description: "Platform OS iOS 17, upgradable to iOS 18.3.2 48 MP Front, 12 MP Back.", image: "iphones.png", rating: "★★★★★", brandId: 1, categoryId: 1 },
    { id: 2, code: "ZMW450",   name: "Book", description: "Source Code : My Beginnings by Bill Gates 2025 Hardcover W/Dust-Jacket BRAND NEW", image: "source_code.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 3, code: "ZMW5486",  name: "Nike Sneakers", description: "Size 10.5 Nike SB Dunk Low Bart Simpson", image: "nike.png", rating: "★★★★★", brandId: 4, categoryId: 5 },
    { id: 4, code: "ZMW6336",  name: "CAT S62 Smartphones", description: "GSM + CDMA 4G Rugged 128GB Android 5.7", image: "CATS62.png", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 5, code: "ZMW17325", name: "Louis Vuitton Handbags", description: "Louis Vuitton Leather Handbag PM", image: "louisv.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 6, code: "ZMW3276",  name: "G-Shocks", description: "Power Trainer Water-Resistant Digital Sport Watch - GBD-800UC-5", image: "GSHOCK1.png", rating: "★★★★★", brandId: 3, categoryId: 4 },
    { id: 7, code: "ZMW4450",  name: "G-Shocks", description: "Black Dial Sports Quartz 200M Men's Watch GA-2300-1A", image: "GSHOCK.png", rating: "★★★★★", brandId: 3, categoryId: 5 }
];

// ────────────────────────────────────────────────
// Global helper to update header counters
// ────────────────────────────────────────────────
function updateCounts() {
    const cart     = JSON.parse(localStorage.getItem('cart'))     || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const compare  = JSON.parse(localStorage.getItem('compare'))  || [];

    const cartCount     = document.getElementById('cart-count');
    const wishlistCount = document.getElementById('wishlist-count');
    const compareCount  = document.getElementById('compare-count');

    if (cartCount)     cartCount.innerHTML     = `Cart (${cart.length})`;
    if (wishlistCount) wishlistCount.innerHTML = `Wishlist (${wishlist.length})`;
    if (compareCount)  compareCount.innerHTML  = `Compare (${compare.length})`;
}

// ────────────────────────────────────────────────
// Main logic – runs once when DOM is ready
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Swiper
    let swiper;
    try {
        swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            slidesPerView: 1,
            spaceBetween: 16,
            breakpoints: {
                640:  { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 32 },
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            keyboard: { enabled: true },
            a11y: {
                prevSlideMessage: 'Previous product',
                nextSlideMessage: 'Next product',
            },
        });
        console.log("Swiper initialized →", swiper);
    } catch (err) {
        console.error("Swiper failed:", err);
    }

    // 2. Render featured products
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = '';

        products.forEach(product => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.dataset.productId = product.id;

            slide.innerHTML = `
                <div class="product-card">
                    <a href="product.html?id=${product.id}" aria-label="View details for ${product.name}">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <h3>${product.code}</h3>
                        <p>${product.name}</p>
                        <div class="rating">${product.rating}</div>
                    </a>
                    <div class="product-actions">
                        <button type="button" class="add-to-cart"    data-product-id="${product.id}">Add to Cart</button>
                        <button type="button" class="add-to-wishlist" data-product-id="${product.id}">Add to Wishlist</button>
                        <button type="button" class="add-to-compare"  data-product-id="${product.id}">Compare</button>
                    </div>
                </div>
            `;
            productList.appendChild(slide);
        });

        // Refresh Swiper after dynamic content is added
        if (swiper) swiper.update();
    }

    // 3. Delegated click handler for all action buttons (cart, wishlist, compare)
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.add-to-cart, .add-to-wishlist, .add-to-compare');
        if (!btn) return;

        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        if (!productId) return;

        let key, successMessage, alreadyMessage;

        if (btn.classList.contains('add-to-cart')) {
            key = 'cart';
            successMessage = 'Added to cart!';
            alreadyMessage = 'Already in cart!';
        } else if (btn.classList.contains('add-to-wishlist')) {
            key = 'wishlist';
            successMessage = 'Added to wishlist!';
            alreadyMessage = 'Already in wishlist!';
        } else if (btn.classList.contains('add-to-compare')) {
            key = 'compare';
            successMessage = 'Added to compare!';
            alreadyMessage = 'Already in compare!';
        }

        let items = JSON.parse(localStorage.getItem(key)) || [];

        if (items.includes(productId)) {
            alert(alreadyMessage);
            return;
        }

        // Disable button briefly + visual feedback
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = '✓ Added';

        items.push(productId);
        localStorage.setItem(key, JSON.stringify(items));
        updateCounts();

        alert(successMessage);

        // Restore button after 1.2 seconds
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1200);
    });

    // 4. Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const input = document.getElementById('search-input');
            const term = input?.value?.trim();
            if (term) {
                window.location.href = `products.html?search=${encodeURIComponent(term)}`;
            } else {
                alert('Please enter a search term.');
            }
        });
    }

    // 5. Initial count update
    updateCounts();

    // 6. Navigation active state (top + bottom)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.top-nav a, .bottom-nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPath);
    });

    // 7. Breadcrumb
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const currentPage = currentPath;
        const pageTitles = {
            'index.html': 'Home',
            'sellers.html': 'Sellers',
            'brands.html': 'All Brands',
            'categories.html': 'All Categories',
            'products.html': 'Products',
            'services.html': 'Services',
            'notifications.html': 'Notifications',
            'compare.html': 'Compare',
            'wishlist.html': 'Wishlist'
        };

        let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];

        const title = pageTitles[currentPage] || 'Home';
        if (navHistory.length === 0 || navHistory[navHistory.length - 1].url !== currentPage) {
            navHistory.push({ url: currentPage, title });
        }

        // Keep last 5
        if (navHistory.length > 5) navHistory = navHistory.slice(-5);
        sessionStorage.setItem('navHistory', JSON.stringify(navHistory));

        let html = '';
        navHistory.forEach((item, i) => {
            if (i < navHistory.length - 1) {
                html += `<a href="${item.url}">${item.title}</a><span class="separator"> > </span>`;
            } else {
                html += `<span aria-current="page">${item.title}</span>`;
            }
        });
        breadcrumb.innerHTML = html;
    }

    updateBreadcrumb();
});
