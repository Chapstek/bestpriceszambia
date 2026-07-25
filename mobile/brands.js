// brands.js
// Brand Data (Simulated Database)
const brands = [
    { id: 1, name: "Apple", description: "iphones", image: "iphones.png" },
    { id: 2, name: "Nike", description: "Sneakers", image: "nike.png" },
    { id: 3, name: "CAT", description: "Smartphones", image: "CATS62.png" },
    { id: 4, name: "Louis Vuitton", description: "Handbags", image: "louisv.png" },
    { id: 5, name: "G-Shock", description: "Water-Resistant Digital Sport Watches", image: "GSHOCK1.png" }
];

// Load Brands
document.addEventListener('DOMContentLoaded', () => {
    const brandList = document.getElementById('brand-list');
    if (brandList) {
        brandList.innerHTML = '';

        brands.forEach(brand => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.innerHTML = `
                <div class="brand-card">
                    <img src="${brand.image}" alt="${brand.name}">
                    <div class="brand-info">
                        <h3>${brand.name}</h3>
                        <p>${brand.description}</p>
                    </div>
                </div>
            `;
            brandList.appendChild(slide);
        });
    }

    // Initialize Swiper after slides are added
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            480: { slidesPerView: 1.25 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });

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
    topNavLinks.forEach(link => { link.classList.remove('active'); });

    // Highlight Current Page in Bottom Navigation
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
    bottomNavLinks.forEach(link => { link.classList.remove('active'); });
    const bottomNavBrands = document.getElementById('bottom-nav-categories');
    if (bottomNavBrands) bottomNavBrands.classList.add('active');

    // Breadcrumb Navigation
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const currentPage = window.location.pathname.split('/').pop();
            let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];

            if (!navHistory.some(item => item.url === currentPage)) {
                navHistory.push({ url: currentPage, title: 'All Brands' });
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