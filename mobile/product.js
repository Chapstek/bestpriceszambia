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

// Load Product Details and Related Products
document.addEventListener('DOMContentLoaded', () => {
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Find the product in the products array
    const product = products.find(p => p.id === productId);

    // Display product details
    const productDetail = document.getElementById('product-detail');
    if (productDetail && product) {
        productDetail.innerHTML = `
            <div class="product-detail-container">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p class="product-price">ZMW ${product.price.toLocaleString()}</p>
                    <p class="product-brand">${product.brandName} | ${product.categoryName}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">${product.rating}</div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button>
                        <button class="add-to-wishlist" data-product-id="${product.id}" aria-label="Add ${product.name} to wishlist">Add to Wishlist</button>
                        <button class="add-to-compare" data-product-id="${product.id}" aria-label="Add ${product.name} to compare">Compare</button>
                    </div>
                    <a href="products.html" class="back-to-products">Back to Products</a>
                </div>
            </div>
        `;

        // Add visual feedback for action buttons
        const updateButtonState = (button, list, addedText) => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            const listItems = JSON.parse(localStorage.getItem(list)) || [];
            if (listItems.includes(productId)) {
                button.textContent = addedText;
                button.disabled = true;
                button.classList.add('added');
            }
        };

        document.querySelectorAll('.add-to-cart').forEach(button => {
            updateButtonState(button, 'cart', 'Added to Cart!');
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (!cart.includes(productId)) {
                    cart.push(productId);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCounts();
                    button.textContent = 'Added to Cart!';
                    button.disabled = true;
                    button.classList.add('added');
                }
            });
        });

        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            updateButtonState(button, 'wishlist', 'Added to Wishlist!');
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                if (!wishlist.includes(productId)) {
                    wishlist.push(productId);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    updateCounts();
                    button.textContent = 'Added to Wishlist!';
                    button.disabled = true;
                    button.classList.add('added');
                }
            });
        });

        document.querySelectorAll('.add-to-compare').forEach(button => {
            updateButtonState(button, 'compare', 'Added to Compare!');
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                const compare = JSON.parse(localStorage.getItem('compare')) || [];
                if (!compare.includes(productId)) {
                    compare.push(productId);
                    localStorage.setItem('compare', JSON.stringify(compare));
                    updateCounts();
                    button.textContent = 'Added to Compare!';
                    button.disabled = true;
                    button.classList.add('added');
                }
            });
        });
    } else if (productDetail) {
        productDetail.innerHTML = '<p>Product not found.</p>';
    }

    // Load Related Products
    const relatedProductList = document.getElementById('related-product-list');
    if (relatedProductList && product) {
        const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id);
        relatedProducts.forEach(relatedProduct => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.setAttribute('role', 'listitem');
            slide.innerHTML = `
                <div class="product-card">
                    <a href="product.html?id=${relatedProduct.id}" aria-label="View details for ${relatedProduct.name}">
                        <div class="image-container">
                            <img src="${relatedProduct.image}" alt="${relatedProduct.name}" loading="lazy">
                        </div>
                        <h3>ZMW ${relatedProduct.price.toLocaleString()}</h3>
                        <p class="product-name">${relatedProduct.name}</p>
                        <p class="product-brand">${relatedProduct.brandName} | ${relatedProduct.categoryName}</p>
                        <p class="product-description" title="${relatedProduct.description}">${relatedProduct.description.substring(0, 50)}${relatedProduct.description.length > 50 ? '...' : ''}</p>
                        <div class="rating">${relatedProduct.rating}</div>
                    </a>
                    <div class="product-actions">
                        <button class="add-to-cart" data-product-id="${relatedProduct.id}" aria-label="Add ${relatedProduct.name} to cart">Add to Cart</button>
                        <button class="add-to-wishlist" data-product-id="${relatedProduct.id}" aria-label="Add ${relatedProduct.name} to wishlist">Add to Wishlist</button>
                        <button class="add-to-compare" data-product-id="${relatedProduct.id}" aria-label="Add ${relatedProduct.name} to compare">Compare</button>
                    </div>
                </div>
            `;
            relatedProductList.appendChild(slide);
        });

        // Initialize Swiper for related products
        const relatedSwiper = new Swiper('.related-swiper', {
            slidesPerView: 3,
            spaceBetween: 20,
            loop: relatedProducts.length >= 4, // Enable loop only if enough slides
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                1024: { slidesPerView: 3 },
                768: { slidesPerView: 2 },
                480: { slidesPerView: 1 },
                0: { slidesPerView: 1 }
            }
        });

        // Add event listeners for related products' action buttons
        document.querySelectorAll('.related-products .add-to-cart').forEach(button => {
            updateButtonState(button, 'cart', 'Added to Cart!');
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (!cart.includes(productId)) {
                    cart.push(productId);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCounts();
                    button.textContent = 'Added to Cart!';
                    button.disabled = true;
                    button.classList.add('added');
                }
            });
        });

        document.querySelectorAll('.related-products .add-to-wishlist').forEach(button => {
            updateButtonState(button, 'wishlist', 'Added to Wishlist!');
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                if (!wishlist.includes(productId)) {
                    wishlist.push(productId);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    updateCounts();
                    button.textContent = 'Added to Wishlist!';
                    button.disabled = true;
                    button.classList.add('added');
                }
            });
        });

        document.querySelectorAll('.related-products .add-to-compare').forEach(button => {
            updateButtonState(button, 'compare', 'Added to Compare!');
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                const compare = JSON.parse(localStorage.getItem('compare')) || [];
                if (!compare.includes(productId)) {
                    compare.push(productId);
                    localStorage.setItem('compare', JSON.stringify(compare));
                    updateCounts();
                    button.textContent = 'Added to Compare!';
                    button.disabled = true;
                    button.classList.add('added');
                }
            });
        });
    }

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

            const pageTitles = {
                'index.html': 'Home',
                'sellers.html': 'Sellers',
                'brands.html': 'All Brands',
                'categories.html': 'All Categories',
                'products.html': 'Products',
                'services.html': 'Services',
                'notifications.html': 'Notifications',
                'compare.html': 'Compare',
                'wishlist.html': 'Wishlist',
                'product.html': product ? product.name : 'Product Details'
            };

            if (pageTitles[currentPage]) {
                pageTitle = pageTitles[currentPage];
            }

            let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];
            
            // Ensure "Products" is in the breadcrumb before the product name
            const productsPage = { url: 'products.html', title: 'Products' };
            const lastItem = navHistory[navHistory.length - 1];
            if (lastItem && lastItem.url !== 'products.html' && currentPage === 'product.html') {
                navHistory.push(productsPage);
            }

            if (navHistory.length === 0 || lastItem.url !== currentPage) {
                navHistory.push({ url: currentPage, title: pageTitle });
            }

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