// Category Data (Simulated Database)
const categories = [
    { id: 1, name: "Phones" },
    { id: 2, name: "Watches" }
//    { id: 3, name: "Skirting Boards" },
//    { id: 4, name: "Transition Laminates" },
//    { id: 5, name: "Stair-Nosing" },
//    { id: 6, name: "Cell Phones & Smartphones" }
];

// Load Categories
document.addEventListener('DOMContentLoaded', () => {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('category-card');
        categoryCard.innerHTML = `
            <h3>${category.name}</h3>
            <a href="products.html?category=${category.id}" class="view-products-btn">View Products</a>
        `;
        categoryList.appendChild(categoryCard);
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
    document.getElementById('nav-categories').classList.add('active');

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
            navHistory.push({ url: currentPage, title: 'All Categories' });
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

