// Brand Data (Simulated Database)
const brands = [
    {
        id: 1,
        name: "Apple",
        description: "iPhone Smartphones and everything else.",
        logo: "iphones.png",
        products: ["Macbooks, iPads and iMacs."]
    },
    {
        id: 2,
        name: "CAT",
        description: "CAT Smartphones and everything else.",
        logo: "CAT.png",
        products: ["Hoodies, Boots, Belt Buckles, and Equipment Spareparts."]
    },
    {
        id: 3,
        name: "G-Shock",
        description: "Smartwatches.",
        logo: "GSHOCK.png",
        products: ["Casio G-Shock Black Dial Sports Quartz 200M Men's Watch GA-2300-1A and many more."]
    },
    {
        id: 4,
        name: "Louis Vuitton",
        description: "Handbags and wallets",
        logo: "LV.png",
        products: ["Louis Vuitton Zippy Wallet Vertical Monogram Eclipse M62295 Black With Box and many more."]
    }
];

// Load Brands
document.addEventListener('DOMContentLoaded', () => {
    const brandList = document.getElementById('brand-list');
    brandList.innerHTML = '';
    brands.forEach(brand => {
        const brandCard = document.createElement('div');
        brandCard.classList.add('brand-card');
        brandCard.innerHTML = `
            <img src="${brand.logo}" alt="${brand.name} Logo">
            <div class="brand-info">
                <h3>${brand.name}</h3>
                <p>${brand.description}</p>
                <p><strong>Products:</strong> ${brand.products.join(', ')}</p>
                <a href="products.html?brand=${brand.id}" class="view-products-btn">View Products</a>
            </div>
        `;
        brandList.appendChild(brandCard);
    });

    // Search Functionality (Redirect to products.html with search term)
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value;
        if (searchTerm) {
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });

    // Update Counts
    updateCounts();

    // Highlight Current Page in Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById('nav-brands').classList.add('active');

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
            navHistory = [{ url: 'index.html', title: 'Home' }];
            navHistory.push({ url: currentPage, title: 'All Brands' });
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
