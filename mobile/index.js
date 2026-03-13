// data.js
// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999.12", name: "Apple iPhone 15 Pro Max 256GB", description: "Latest iPhone with 256GB storage, perfect for professionals.", image: "iphones.png", rating: "★★★★★", brandId: 5, categoryId: 6 },
    { id: 2, code: "ZMW4,068.71", name: "G-Shock", description: "Durable glue-down vinyl flooring, perfect for heavy traffic areas.", image: "Aurora.jpg", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 3, code: "ZMW456.41", name: "Skirting and quarter rounds (Sold Separately)", description: "Matching skirting boards for 8mm laminates, sold separately.", image: "skirtings.jpg", rating: "★★★★★", brandId: 4, categoryId: 3 },
    { id: 4, code: "ZMW394.85", name: "MDF Luxwrap Transition Laminates", description: "Transition laminates for seamless flooring transitions.", image: "mdf.jpg", rating: "★★★★★", brandId: 3, categoryId: 4 },
    { id: 5, code: "ZMW472.61", name: "MDF Luxwrap Stair-Nosing", description: "Stair-nosing for safe and stylish stair edges.", image: "mdf_lux.jpg", rating: "★★★★★", brandId: 3, categoryId: 5 }
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


