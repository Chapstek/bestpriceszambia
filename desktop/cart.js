// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999.12", name: "Apple iPhone 15 Pro Max 256GB", description: "Latest iPhone with 256GB storage, perfect for professionals.", image: "iphones.png", rating: "★★★★★", brandId: 5, categoryId: 6 },
    { id: 2, code: "ZMW4331.45", name: "G-Shock GA-2100-1A1", description: "Shock resistant, 200m water resistance, World time, Stopwatch & countdown timer, LED light", image: "GSHOCK.png", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 3, code: "ZMW6336.38", name: "CAT S-62", description: "Display: 5.7″ IPS LCD, Full HD+ (1080 × 2160) with Corning Gorilla Glass 6 protection — works with wet fingers & gloves.Qualcomm Snapdragon 660 octa-core (mid-range, reliable)RAM & Storage: 4 GB RAM + 128 GB storage (expandable with microSD).Operating System: Android 10, upgradable to Android 11.", image: "CATS62.png", rating: "★★★★★", brandId: 4, categoryId: 3 },
   // { id: 4, code: "ZMW394.85", name: "MDF Luxwrap Transition Laminates", description: "Transition laminates for seamless flooring transitions.", image: "mdf.jpg", rating: "★★★★★", brandId: 3, categoryId: 4 },
   // { id: 5, code: "ZMW472.61", name: "MDF Luxwrap Stair-Nosing", description: "Stair-nosing for safe and stylish stair edges.", image: "mdf_lux.jpg", rating: "★★★★★", brandId: 3, categoryId: 5 }
];

// Load Cart Items
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartProducts = products.filter(product => cart.includes(product.id));

    if (cartProducts.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = 'ZMW0.00';
    } else {
        let total = 0;
        cartItems.innerHTML = '';
        cartProducts.forEach(product => {
            const price = parseFloat(product.code.replace('ZMW', '').replace(',', ''));
            total += price;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;">
                <h3>${product.name}</h3>
                <p>${product.code}</p>
                <button class="remove-from-cart" data-product-id="${product.id}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
        cartTotal.textContent = `ZMW${total.toFixed(2)}`;
    }

    // Search Functionality (Redirect to products.html with search term)
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value;
        if (searchTerm) {
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });

    // Remove from Cart
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(id => id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCounts();
            window.location.reload();
        });
    });

    // Checkout Button (Placeholder)
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Checkout functionality coming soon!');
    });

    // Update Counts
    updateCounts();

    // Highlight Current Page in Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
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
        const currentPage = window.location.pathname.split('/').pop();

        // Get navigation history from sessionStorage
        let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];
        
        // Add current page to history if not already the last entry
        if (navHistory.length === 0 || navHistory[navHistory.length - 1].url !== currentPage) {
            navHistory = [{ url: 'index.html', title: 'Home' }]; // Cart is a top-level page
            navHistory.push({ url: currentPage, title: 'Cart' });
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
