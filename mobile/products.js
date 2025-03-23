// products.js
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

// Load Products
document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = '';

        // Filter products based on search query
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search')?.toLowerCase() || '';

        const filteredProducts = searchTerm
            ? products.filter(product =>
                  product.name.toLowerCase().includes(searchTerm) ||
                  product.description.toLowerCase().includes(searchTerm)
              )
            : products;

        // Display products as Swiper slides
        filteredProducts.forEach(product => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.setAttribute('data-product-id', product.id);
            slide.innerHTML = `
                <div class="product-card">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.code}</h3>
                        <p>${product.name}</p>
                        <div class="rating">${product.rating}</div>
                    </a>
                    <div class="product-actions">
                        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                        <button class="add-to-wishlist" data-product-id="${product.id}">Add to Wishlist</button>
                        <button class="add-to-compare" data-product-id="${product.id}">Compare</button>
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
            const searchTerm = document.getElementById('search-input').value;
            if (searchTerm) {
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
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
    const topNavLinks = document.querySelectorAll('nav a');
    if (topNavLinks) {
        topNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const navProducts = document.getElementById('nav-products');
        if (navProducts) navProducts.classList.add('active');
    }

    // Highlight Current Page in Bottom Navigation
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
    if (bottomNavLinks) {
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const bottomNavProducts = document.getElementById('bottom-nav-categories'); // "Apps" maps to Categories
        if (bottomNavProducts) bottomNavProducts.classList.add('active');
    }

    // Breadcrumb Navigation
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const currentPage = window.location.pathname.split('/').pop();
            let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];

            if (!navHistory.some(item => item.url === currentPage)) {
                navHistory.push({ url: currentPage, title: 'Products' });
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