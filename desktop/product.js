// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999.12", name: "Apple iPhone 15 Pro Max 256GB", description: "Latest iPhone with 256GB storage, perfect for professionals.", image: "iphones.png", rating: "★★★★★", brandId: 5, categoryId: 6 },
    { id: 2, code: "ZMW4331.45", name: "G-Shock GA-2100-1A1", description: "Shock resistant, 200m water resistance, World time, Stopwatch & countdown timer, LED light", image: "GSHOCK.png", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 3, code: "ZMW6336.38", name: "CAT S-62", description: "Display: 5.7″ IPS LCD, Full HD+ (1080 × 2160) with Corning Gorilla Glass 6 protection — works with wet fingers & gloves.Qualcomm Snapdragon 660 octa-core (mid-range, reliable)RAM & Storage: 4 GB RAM + 128 GB storage (expandable with microSD).Operating System: Android 10, upgradable to Android 11.", image: "CATS62.png", rating: "★★★★★", brandId: 4, categoryId: 3 },
    { id: 4, code: "ZMW394.85", name: "MDF Luxwrap Transition Laminates", description: "Transition laminates for seamless flooring transitions.", image: "mdf.jpg", rating: "★★★★★", brandId: 3, categoryId: 4 },
    { id: 5, code: "ZMW472.61", name: "MDF Luxwrap Stair-Nosing", description: "Stair-nosing for safe and stylish stair edges.", image: "mdf_lux.jpg", rating: "★★★★★", brandId: 3, categoryId: 5 }
];

// Brand Data (Simulated Database)
const brands = [
    { id: 1, name: "ARmonia" },
    { id: 2, name: "Aurora" },
    { id: 3, name: "Luxwrap" },
    { id: 4, name: "Quality Skirtings" },
    { id: 5, name: "Apple" }
];

// Category Data (Simulated Database)
const categories = [
    { id: 1, name: "Laminate Flooring" },
    { id: 2, name: "Vinyl Flooring" },
    { id: 3, name: "Skirting Boards" },
    { id: 4, name: "Transition Laminates" },
    { id: 5, name: "Stair-Nosing" },
    { id: 6, name: "Cell Phones & Smartphones" }
];

// Load Product Details
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    // Populate product details
    if (product) {
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-image').alt = product.name;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-code').textContent = product.code;
        document.getElementById('product-rating').textContent = product.rating;
        document.getElementById('product-description').textContent = product.description;

        // Add product ID to buttons for event handling
        document.getElementById('add-to-cart-btn').setAttribute('data-product-id', product.id);
        document.getElementById('add-to-wishlist-btn').setAttribute('data-product-id', product.id);
        document.getElementById('add-to-compare-btn').setAttribute('data-product-id', product.id);
    } else {
        document.querySelector('.product-details').innerHTML = '<p>Product not found.</p>';
    }

    // Search Functionality (Redirect to products.html with search term)
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value;
        if (searchTerm) {
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });

    // Add to Cart
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        const productId = parseInt(document.getElementById('add-to-cart-btn').getAttribute('data-product-id'));
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

    // Add to Wishlist
    document.getElementById('add-to-wishlist-btn').addEventListener('click', () => {
        const productId = parseInt(document.getElementById('add-to-wishlist-btn').getAttribute('data-product-id'));
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

    // Add to Compare
    document.getElementById('add-to-compare-btn').addEventListener('click', () => {
        const productId = parseInt(document.getElementById('add-to-compare-btn').getAttribute('data-product-id'));
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

    // Update Counts
    updateCounts();

    // Highlight Current Page in Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById('nav-products').classList.add('active');

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
        const currentPage = window.location.pathname.split('/').pop();
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);

        // Get navigation history from sessionStorage
        let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];
        
        // Add current page to history if not already the last entry
        if (navHistory.length === 0 || navHistory[navHistory.length - 1].url !== currentPage) {
            // Check if coming from products.html with a brand or category filter
            const referrer = document.referrer;
            if (referrer.includes('products.html')) {
                const referrerParams = new URL(referrer).searchParams;
                const brandId = referrerParams.get('brand');
                const categoryId = referrerParams.get('category');
                if (brandId) {
                    const brand = brands.find(b => b.id === parseInt(brandId));
                    navHistory = [
                        { url: 'index.html', title: 'Home' },
                        { url: 'brands.html', title: 'All Brands' },
                        { url: `products.html?brand=${brandId}`, title: `${brand.name} Products` }
                    ];
                } else if (categoryId) {
                    const category = categories.find(c => c.id === parseInt(categoryId));
                    navHistory = [
                        { url: 'index.html', title: 'Home' },
                        { url: 'categories.html', title: 'All Categories' },
                        { url: `products.html?category=${categoryId}`, title: `${category.name}` }
                    ];
                } else {
                    navHistory = [
                        { url: 'index.html', title: 'Home' },
                        { url: 'products.html', title: 'Products' }
                    ];
                }
            } else {
                navHistory = [
                    { url: 'index.html', title: 'Home' },
                    { url: 'products.html', title: 'Products' }
                ];
            }
            navHistory.push({ url: currentPage, title: product ? product.name : 'Product Details' });
        }
        
        // Limit history to avoid infinite growth
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




