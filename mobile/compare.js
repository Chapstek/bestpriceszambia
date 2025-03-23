// compare.js
// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999", name: "Apple iPhone 15 Pro Max 256GB", description: "Platform OS iOS 17, upgradable to iOS 18.3.2 48 MP Front, 12 MP Back.", image: "iphones.png", rating: "★★★★★", brandId: 1, categoryId: 1 },
    { id: 2, code: "ZMW450", name: "Book", description: "Source Code : My Beginnings by Bill Gates 2025 Hardcover W/Dust-Jacket BRAND NEW", image: "source_code.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 3, code: "ZMW5486", name: "Nike Sneakers", description: "Size 10.5 Nike SB Dunk Low Bart Simpson", image: "nike.png", rating: "★★★★★", brandId: 4, categoryId: 5 },
    { id: 4, code: "ZMW6336", name: "CAT S62 Smartphones", description: "GSM + CDMA 4G Rugged 128GB Android 5.7", image: "CATS62.png", rating: "★★★★★", brandId: 2, categoryId: 2 },
    { id: 5, code: "ZMW17325", name: "Louis Vuitton Handbags", description: "Louis Vuitton Leather Handbag PM", image: "louisv.png", rating: "★★★★★", brandId: 3, categoryId: 3 },
    { id: 6, code: "ZMW3276", name: "G-Shocks", description: "Power Trainer Water-Resistant Digital Sport Watch - GBD-800UC-5", image: "GSHOCK1.png", rating: "★★★★★", brandId: 3, categoryId: 4 },
    { id: 7, code: "ZMW4450.", name: "G-Shocks", description: "Black Dial Sports Quartz 200M Men's Watch GA-2300-1A", image: "GSHOCK.png", rating: "★★★★★", brandId: 3, categoryId: 5 }
];

// Load Compare Table
document.addEventListener('DOMContentLoaded', () => {
    const compareTable = document.getElementById('compare-table');
    if (compareTable) {
        const compare = JSON.parse(localStorage.getItem('compare')) || [];
        const compareProducts = products.filter(product => compare.includes(product.id));

        if (compareProducts.length === 0) {
            compareTable.innerHTML = '<p>No products to compare.</p>';
            return;
        }

        let tableHTML = '<table><thead><tr><th></th>';
        compareProducts.forEach(product => {
            tableHTML += `
                <th>
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <button class="remove-from-compare" data-product-id="${product.id}">Remove</button>
                </th>
            `;
        });
        tableHTML += '</tr></thead><tbody>';

        // Add rows for comparison
        tableHTML += `
            <tr>
                <td>Code</td>
                ${compareProducts.map(product => `<td>${product.code}</td>`).join('')}
            </tr>
            <tr>
                <td>Description</td>
                ${compareProducts.map(product => `<td>${product.description}</td>`).join('')}
            </tr>
            <tr>
                <td>Rating</td>
                ${compareProducts.map(product => `<td>${product.rating}</td>`).join('')}
            </tr>
        `;

        tableHTML += '</tbody></table>';
        compareTable.innerHTML = tableHTML;

        // Remove from Compare
        document.querySelectorAll('.remove-from-compare').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                const compare = JSON.parse(localStorage.getItem('compare')) || [];
                const updatedCompare = compare.filter(id => id !== productId);
                localStorage.setItem('compare', JSON.stringify(updatedCompare));
                updateCounts();
                window.location.reload();
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
    }

    // Highlight Current Page in Bottom Navigation
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
    if (bottomNavLinks) {
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const bottomNavCompare = document.getElementById('bottom-nav-compare');
        if (bottomNavCompare) bottomNavCompare.classList.add('active');
    }

    // Breadcrumb Navigation
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const currentPage = window.location.pathname.split('/').pop();
            let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];

            if (!navHistory.some(item => item.url === currentPage)) {
                navHistory.push({ url: currentPage, title: 'Compare' });
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