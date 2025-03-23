// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999.12", name: "Apple iPhone 15 Pro Max 256GB", description: "Platform OS iOS 17, upgradable to iOS 18.3.2 48 MP Front, 12 MP Back.", image: "iphones.png", rating: "★★★★★", brandId: 1, categoryId: 1 },
    { id: 2, code: "ZMW4006.71", name: "G-Shock", description: "G-Shock", image: "g-shock.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 3, code: "ZMW4545.00", name: "Skirting", description: "Skirting and quarter round", image: "skirting.png", rating: "★★★★★", brandId: 4, categoryId: 5 },
    { id: 4, code: "ZMW6336.38", name: "CAT S62 Smartphone", description: "GSM + CDMA 4G Rugged 128GB Android 5.7", image: "CATS62.png", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 5, code: "ZMW4331.45", name: "G-Shock", description: "Smartwatches.", image: "GSHOCK.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 6, code: "ZMW3176.40", name: "G-Shock", description: "Power Trainer Water-Resistant Digital Sport Watch - GBD-800UC-5", image: "GSHOCK1.png", rating: "★★★★★", brandId: 3, categoryId: 4 },
    { id: 7, code: "ZMW4331.45", name: "G-Shock", description: "Black Dial Sports Quartz 200M Men's Watch GA-2300-1A", image: "GSHOCK.png", rating: "★★★★★", brandId: 3, categoryId: 5 }
];

// Load Wishlist Table
document.addEventListener('DOMContentLoaded', () => {
    const wishlistTable = document.getElementById('wishlist-table');
    if (wishlistTable) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const wishlistProducts = products.filter(product => wishlist.includes(product.id));

        if (wishlistProducts.length === 0) {
            wishlistTable.innerHTML = '<p>No products in your wishlist.</p>';
            return;
        }

        let tableHTML = '<table><tr><th></th>';
        wishlistProducts.forEach(product => {
            tableHTML += `<th>${product.name}</th>`;
        });
        tableHTML += '</tr>';

        // Image Row
        tableHTML += '<tr><td>Image</td>';
        wishlistProducts.forEach(product => {
            tableHTML += `<td><img src="${product.image}" alt="${product.name}"></td>`;
        });
        tableHTML += '</tr>';

        // Code Row
        tableHTML += '<tr><td>Code</td>';
        wishlistProducts.forEach(product => {
            tableHTML += `<td>${product.code}</td>`;
        });
        tableHTML += '</tr>';

        // Description Row
        tableHTML += '<tr><td>Description</td>';
        wishlistProducts.forEach(product => {
            tableHTML += `<td>${product.description}</td>`;
        });
        tableHTML += '</tr>';

        // Rating Row
        tableHTML += '<tr><td>Rating</td>';
        wishlistProducts.forEach(product => {
            tableHTML += `<td>${product.rating}</td>`;
        });
        tableHTML += '</tr>';

        // Actions Row
        tableHTML += '<tr><td>Actions</td>';
        wishlistProducts.forEach(product => {
            tableHTML += `
                <td>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                    <button class="remove-from-wishlist" data-product-id="${product.id}">Remove</button>
                </td>
            `;
        });
        tableHTML += '</tr>';

        tableHTML += '</table>';
        wishlistTable.innerHTML = tableHTML;

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

        // Remove from Wishlist
        document.querySelectorAll('.remove-from-wishlist').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                wishlist = wishlist.filter(id => id !== productId);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                updateCounts();
                location.reload(); // Reload to update the table
            });
        });
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

    // Update Counts
    updateCounts();

    // Highlight Current Page in Top Navigation
    const topNavLinks = document.querySelectorAll('nav a');
    if (topNavLinks) {
        topNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const navHome = document.getElementById('nav-home');
        if (navHome) navHome.classList.add('active');
    }

    // Highlight Current Page in Bottom Navigation
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
    if (bottomNavLinks) {
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const bottomNavWishlist = document.getElementById('bottom-nav-wishlist');
        if (bottomNavWishlist) bottomNavWishlist.classList.add('active');
    }

    // Breadcrumb Navigation
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const currentPage = window.location.pathname.split('/').pop();

            let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];
            if (!navHistory.some(item => item.url === currentPage)) {
                navHistory.push({ url: currentPage, title: 'Wishlist' });
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