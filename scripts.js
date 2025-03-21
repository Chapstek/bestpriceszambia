// Detect if the user is on a mobile device
function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
}

// Apply mobile-view class on page load
document.addEventListener('DOMContentLoaded', () => {
    if (isMobileDevice()) {
        document.body.classList.add('mobile-view');
    }

// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999.12", name: "Apple iPhone 15 Pro Max 256GB", description: "Latest iPhone with 256GB storage, perfect for professionals.", image: "iphones.png", rating: "★★★★★", brandId: 5, categoryId: 6 },
    { id: 2, code: "ZMW4,068.71", name: "G-Shock", description: "Durable glue-down vinyl flooring, perfect for heavy traffic areas.", image: "Aurora.jpg", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 3, code: "ZMW456.41", name: "Skirting and quarter rounds (Sold Separately)", description: "Matching skirting boards for 8mm laminates, sold separately.", image: "skirtings.jpg", rating: "★★★★★", brandId: 4, categoryId: 3 },
    { id: 4, code: "ZMW394.85", name: "MDF Luxwrap Transition Laminates", description: "Transition laminates for seamless flooring transitions.", image: "mdf.jpg", rating: "★★★★★", brandId: 3, categoryId: 4 },
    { id: 5, code: "ZMW472.61", name: "MDF Luxwrap Stair-Nosing", description: "Stair-nosing for safe and stylish stair edges.", image: "mdf_lux.jpg", rating: "★★★★★", brandId: 3, categoryId: 5 }
];

// Brand Data (Simulated Database)
const brands = [
    { id: 1, name: "ARmonia" },
    { id: 2, name: "Aurora" },
    { id: 3, name: "Luxwrap" },
    { id: 4, name: "Quality Skirtings" },
    { id: 5, name: "Apple" } // Added Apple brand
];

// Category Data (Simulated Database)
const categories = [
    { id: 1, name: "Laminate Flooring" },
    { id: 2, name: "Vinyl Flooring" },
    { id: 3, name: "Skirting Boards" },
    { id: 4, name: "Transition Laminates" },
    { id: 5, name: "Stair-Nosing" },
    { id: 6, name: "Cell Phones & Smartphones" } // Added category for iPhone
];

// Initialize Swiper
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        1024: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        480: { slidesPerView: 2 },
        0: { slidesPerView: 1 }
    }
});

// Load Products (already populated in HTML, but we can add logic for search)
document.addEventListener('DOMContentLoaded', () => {
    // Search Functionality
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const productList = document.getElementById('product-list');
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)
        );

        productList.innerHTML = '';
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

        swiper.update(); // Update Swiper after changing slides
    });

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

    // Highlight Current Page in Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'index.html') {
        document.getElementById('nav-home').classList.add('active');
    }

    // Lead Magnet Pop-up Logic
    const popup = document.getElementById('lead-magnet-popup');
    const closeBtn = document.getElementById('close-popup-btn');
    const leadMagnetForm = document.getElementById('lead-magnet-form');

    setTimeout(() => {
        popup.style.display = 'flex';
    }, 2000);

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    leadMagnetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        const leads = JSON.parse(localStorage.getItem('leads')) || [];
        leads.push(email);
        localStorage.setItem('leads', JSON.stringify(leads));
        console.log('Lead captured:', email);
        alert('Thank you! Download link will be sent to your email.');
        popup.style.display = 'none';
    });

    // Handle Newsletter Form Submission
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        console.log('Subscriber email captured:', email);
        alert('Thank you for subscribing!');
        e.target.reset();
    });

    // Breadcrumb Navigation
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Get navigation history from sessionStorage
        let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];
        
        // Add current page to history if not already the last entry
        if (navHistory.length === 0 || navHistory[navHistory.length - 1].url !== currentPage) {
            navHistory = []; // Clear history for Home page
            navHistory.push({ url: currentPage, title: 'Home' });
        }
        
        // Limit history to avoid infinite growth (e.g., last 5 pages)
        if (navHistory.length > 5) {
            navHistory = navHistory.slice(-5);
        }
        
        // Save updated history
        sessionStorage.setItem('navHistory', JSON.stringify(navHistory));

        // Generate breadcrumb HTML
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

    updateBreadcrumb();
});

// Load Cart, Wishlist, and Compare Counts
function updateCounts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const compare = JSON.parse(localStorage.getItem('compare')) || [];
    document.getElementById('cart-count').textContent = `Cart (${cart.length})`;
    document.getElementById('wishlist-count').textContent = `Wishlist (${wishlist.length})`;
    document.getElementById('compare-count').textContent = `Compare (${compare.length})`;
}