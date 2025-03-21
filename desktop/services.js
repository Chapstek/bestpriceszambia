// Service Data (Simulated Database)
const services = [
    { id: 1, name: "Flooring Installation", description: "Professional installation services for all types of flooring." },
    { id: 2, name: "Consultation", description: "Expert advice on choosing the right flooring for your needs." },
    { id: 3, name: "Maintenance", description: "Keep your floors in top condition with our maintenance services." }
];

// Load Services
document.addEventListener('DOMContentLoaded', () => {
    const serviceList = document.getElementById('service-list');
    serviceList.innerHTML = '';
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.classList.add('service-card');
        serviceCard.innerHTML = `
            <h3>${service.name}</h3>
            <p>${service.description}</p>
        `;
        serviceList.appendChild(serviceCard);
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
    document.getElementById('nav-services').classList.add('active');

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
            navHistory.push({ url: currentPage, title: 'Services' });
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
