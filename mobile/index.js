// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999", name: "Apple iPhone 15 Pro Max 256GB", description: "Platform OS iOS 17, upgradable to iOS 18.3.2 48 MP Front, 12 MP Back.", image: "iphones.png", rating: "★★★★★", brandId: 1, categoryId: 1 },
    { id: 2, code: "ZMW450", name: "Book", description: "Source Code : My Beginnings by Bill Gates 2025 Hardcover W/Dust-Jacket BRAND NEW", image: "source_code.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 3, code: "ZMW5486", name: "Nike Sneakers", description: "Size 10.5 Nike SB Dunk Low Bart Simpson", image: "nike.png", rating: "★★★★★", brandId: 4, categoryId: 5 },
    { id: 4, code: "ZMW6336", name: "CAT S62 Smartphones", description: "GSM + CDMA 4G Rugged 128GB Android 5.7", image: "CATS62.png", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 5, code: "ZMW17325", name: "Louis Vuitton Handbags", description: "Louis Vuitton Leather Handbag PM", image: "louisv.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 6, code: "ZMW3276", name: "G-Shocks", description: "Power Trainer Water-Resistant Digital Sport Watch - GBD-800UC-5", image: "GSHOCK1.png", rating: "★★★★★", brandId: 3, categoryId: 4 },
    { id: 7, code: "ZMW4450.", name: "G-Shocks", description: "Black Dial Sports Quartz 200M Men's Watch GA-2300-1A", image: "GSHOCK.png", rating: "★★★★★", brandId: 3, categoryId: 5 }
];

// Initialize Swiper
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        1024: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        480: { slidesPerView: 1.25 },
        0: { slidesPerView: 1.25 }
    }
});

// Update Counts (for cart, wishlist, compare)
function updateCounts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const compare = JSON.parse(localStorage.getItem('compare')) || [];

    const cartCount = document.getElementById('cart-count');
    const wishlistCount = document.getElementById('wishlist-count');
    const compareCount = document.getElementById('compare-count');

    if (cartCount) cartCount.textContent = `Cart (${cart.length})`;
    if (wishlistCount) wishlistCount.textContent = `Wishlist (${wishlist.length})`;
    if (compareCount) compareCount.textContent = `Compare (${compare.length})`;
}

// Load Featured Products and Handle Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Load Featured Products
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = '';

        // Display all products as Swiper slides
        products.forEach(product => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.setAttribute('data-product-id', product.id);
            slide.innerHTML = `
                <div class="product-card">
                    <a href="product.html?id=${product.id}" aria-label="View details for ${product.name}">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.code}</h3>
                        <p>${product.name}</p>
                        <div class="rating">${product.rating}</div>
                    </a>
                    <div class="product-actions">
                        <button class="add-to-cart" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button>
                        <button class="add-to-wishlist" data-product-id="${product.id}" aria-label="Add ${product.name} to wishlist">Add to Wishlist</button>
                        <button class="add-to-compare" data-product-id="${product.id}" aria-label="Add ${product.name} to compare">Compare</button>
                    </div>
                </div>
            `;
            productList.appendChild(slide);
        });

        // Update Swiper after adding slides
        swiper.update();
    }

    // Search Functionality
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = document.getElementById('search-input').value.trim();
            if (searchTerm) {
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            } else {
                alert('Please enter a search term.');
            }
        });
    }

    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (!cart.includes(productId)) {
                cart.push(productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCounts();
                alert('Product added to cart!');
            } else {
                alert('Product already in cart!');
            }
        });
    });

    // Add to Wishlist
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            if (!wishlist.includes(productId)) {
                wishlist.push(productId);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                updateCounts();
                alert('Product added to wishlist!');
            } else {
                alert('Product already in wishlist!');
            }
        });
    });

    // Add to Compare
    document.querySelectorAll('.add-to-compare').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            const compare = JSON.parse(localStorage.getItem('compare')) || [];
            if (!compare.includes(productId)) {
                compare.push(productId);
                localStorage.setItem('compare', JSON.stringify(compare));
                updateCounts();
                alert('Product added to compare!');
            } else {
                alert('Product already in compare!');
            }
        });
    });

    // Update Counts
    updateCounts();

    // Highlight Current Page in Top Navigation
    const topNavLinks = document.querySelectorAll('.top-nav a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (topNavLinks) {
        topNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            }
        });
    }

    // Highlight Current Page in Bottom Navigation
    const bottomNavLinks = document.querySelectorAll('.bottom-nav a');
    if (bottomNavLinks) {
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            }
        });
    }

    // Breadcrumb Navigation
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            let pageTitle = 'Home';

            // Map page URLs to titles
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

            if (pageTitles[currentPage]) {
                pageTitle = pageTitles[currentPage];
            }

            let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];
            
            // Only add the current page if it's not already the last in the history
            if (navHistory.length === 0 || navHistory[navHistory.length - 1].url !== currentPage) {
                navHistory.push({ url: currentPage, title: pageTitle });
            }

            // Limit breadcrumb history to 5 items
            if (navHistory.length > 5) {
                navHistory = navHistory.slice(-5);
            }

            sessionStorage.setItem('navHistory', JSON.stringify(navHistory));

            let breadcrumbHTML = '';
            navHistory.forEach((item, index) => {
                if (index < navHistory.length - 1) {
                    breadcrumbHTML += `<a href="${item.url}" aria-label="Go to ${item.title}">${item.title}</a><span class="separator">></span>`;
                } else {
                    breadcrumbHTML += `<span aria-current="page">${item.title}</span>`;
                }
            });

            breadcrumb.innerHTML = breadcrumbHTML;
        }
    }

    updateBreadcrumb();
});