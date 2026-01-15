// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999.12", name: "Apple iPhone 15 Pro Max 256GB", description: "Platform OS iOS 17, upgradable to iOS 18.3.2 48 MP Front, 12 MP Back.", image: "iphones.png", rating: "★★★★★", brandId: 1, categoryId: 1 },
    { id: 2, code: "ZMW4331.45", name: "G-Shock GA-2100-1A1", description: "Shock resistant, 200m water resistance, World time, Stopwatch & countdown timer, LED light", image: "GSHOCK.png", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 3, code: "ZMW6336.38", name: "CAT S62 Smartphone", description: "GSM + CDMA 4G Rugged 128GB Android 5.7", image: "CATS62.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
//    { id: 3, code: "ZMW4331.45", name: "G-Shock", description: "Smartwatches.", image: "GSHOCK.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
//    { id: 4, code: "ZMW3176.40", name: "G-Shock", description: "Power Trainer Water-Resistant Digital Sport Watch - GBD-800UC-5", image: "GSHOCK1.png", rating: "★★★★★", brandId: 3, categoryId: 4 },
//    { id: 5, code: "ZMW4331.45", name: "G-Shock", description: "Black Dial Sports Quartz 200M Men's Watch GA-2300-1A", image: "GSHOCK.png", rating: "★★★★★", brandId: 3, categoryId: 5 }
];

// Brand Data (Simulated Database)
const brands = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Casio" },
    { id: 3, name: "CAT" }
   // { id: 4, name: "Louis Vuitton" }
];

// Category Data (Simulated Database)
const categories = [
    { id: 1, name: "Phones" },
    { id: 2, name: "Watches" }
  //  { id: 3, name: "Skirting Boards" },
  //  { id: 4, name: "Transition Laminates" },
  //  { id: 5, name: "Stair-Nosing" }
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

// Load Products
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const brandId = parseInt(urlParams.get('brand'));
    const categoryId = parseInt(urlParams.get('category'));
    const productsTitle = document.getElementById('products-title');
    const productList = document.getElementById('product-list');

    let filteredProducts = products;
    if (brandId) {
        filteredProducts = products.filter(product => product.brandId === brandId);
        const brand = brands.find(b => b.id === brandId);
        productsTitle.textContent = `${brand.name} Products`;
    } else if (categoryId) {
        filteredProducts = products.filter(product => product.categoryId === categoryId);
        const category = categories.find(c => c.id === categoryId);
        productsTitle.textContent = category.name;
    } else {
        productsTitle.textContent = 'All Products';
    }

    // Function to render products
    function renderProducts(productsToRender) {
        productList.innerHTML = '';
        productsToRender.forEach(product => {
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
        swiper.update();
    }

    // Initial render of filtered products
    renderProducts(filteredProducts);

    // Search Functionality (Filter on the same page)
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const searchedProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(searchedProducts);
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
        const brandId = parseInt(urlParams.get('brand'));
        const categoryId = parseInt(urlParams.get('category'));

        // Get navigation history from sessionStorage
        let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];
        
        // Add current page to history if not already the last entry
        if (navHistory.length === 0 || navHistory[navHistory.length - 1].url !== currentPage) {
            navHistory = [{ url: 'index.html', title: 'Home' }];
            if (brandId) {
                const brand = brands.find(b => b.id === brandId);
                navHistory.push({ url: 'brands.html', title: 'All Brands' });
                navHistory.push({ url: currentPage, title: `${brand.name} Products` });
            } else if (categoryId) {
                const category = categories.find(c => c.id === categoryId);
                navHistory.push({ url: 'categories.html', title: 'All Categories' });
                navHistory.push({ url: currentPage, title: `${category.name}` });
            } else {
                navHistory.push({ url: currentPage, title: 'Products' });
            }
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




