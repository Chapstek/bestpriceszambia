// brands.js
// Brand Data (Simulated Database)
const brands = [
     { id: 1, name: "Apple", description: "iphones", image: "iphones.png", rating: "★★★★★", brandId: 1, categoryId: 1 },
    { id: 2,  name: "Nike", description: "Sneakers", image: "nike.png", rating: "★★★★★", brandId: 4, categoryId: 5 },
    { id: 3,  name: "CAT", description: "Smartphones", image: "CATS62.png", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 4,  name: "Louis Vuitton", description: "Handbags", image: "louisv.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 5,  name: "G-Shock", description: "Water-Resistant Digital Sport Watches", image: "GSHOCK1.png", rating: "★★★★★", brandId: 3, categoryId: 4 },
	];

// Initialize Swiper
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,
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
        1024: { slidesPerView: 3 },
        768: { slidesPerView: 2 },
        480: { slidesPerView: 1.25 },
        0: { slidesPerView: 1.25 }
    }
});

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

        swiper.update();
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
        const navBrands = document.getElementById('nav-brands');
        if (navBrands) navBrands.classList.add('active');
    }

    // Highlight Current Page in Bottom Navigation
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
    if (bottomNavLinks) {
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const bottomNavBrands = document.getElementById('bottom-nav-categories'); // "Apps" maps to Categories
        if (bottomNavBrands) bottomNavBrands.classList.add('active');
    }

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