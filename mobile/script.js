// Detect Mobile View
function applyMobileView() {
    const isMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
    console.log('Applying mobile view:', isMobile);
    document.body.classList.toggle('mobile-view', isMobile);
}

// Apply immediately and on resize
applyMobileView();
window.addEventListener('load', applyMobileView);
window.addEventListener('resize', applyMobileView);

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (!hamburger || !nav) {
        console.error('Hamburger menu elements not found:', { hamburger, nav });
        return;
    }

    console.log('Hamburger menu elements found:', { hamburger, nav });

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
        hamburger.textContent = isExpanded ? '☰' : '✕';
        console.log('Hamburger menu toggled:', { isExpanded: !isExpanded, navClassList: nav.classList.toString() });
    });
});

// Rest of script.js (e.g., product grid population, etc.)
// Show Free Guide Pop-Up
window.showFreeGuidePopup = function() {
    const modal = document.getElementById('free-guide-modal');
    if (modal && !sessionStorage.getItem('freeGuidePopupShown')) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        sessionStorage.setItem('freeGuidePopupShown', 'true');
        // Focus on the first form element for accessibility
        const emailInput = document.getElementById('free-guide-email');
        if (emailInput) emailInput.focus();
    }
};

// Hide Free Guide Pop-Up
window.hideFreeGuidePopup = function() {
    const modal = document.getElementById('free-guide-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
};

// Toggle Menu with Accessibility
function toggleMenu() {
    const nav = document.querySelector('header nav');
    const hamburger = document.querySelector('.hamburger');
    const isExpanded = nav.classList.toggle('active');
    hamburger.textContent = isExpanded ? '✖' : '☰';
    hamburger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
}

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Free Guide Pop-Up Trigger (after 5 seconds)
    setTimeout(() => {
        showFreeGuidePopup();
    }, 5000);

    // Free Guide Pop-Up Close Button
    const freeGuideModalClose = document.getElementById('free-guide-modal-close');
    if (freeGuideModalClose) {
        freeGuideModalClose.addEventListener('click', hideFreeGuidePopup);
    }

    // Free Guide Pop-Up Decline Link
    const freeGuideModalDecline = document.getElementById('free-guide-modal-decline');
    if (freeGuideModalDecline) {
        freeGuideModalDecline.addEventListener('click', (e) => {
            e.preventDefault();
            hideFreeGuidePopup();
        });
    }

    // Close Free Guide Pop-Up When Clicking Outside
    const freeGuideModal = document.getElementById('free-guide-modal');
    if (freeGuideModal) {
        freeGuideModal.addEventListener('click', (e) => {
            if (e.target === freeGuideModal) {
                hideFreeGuidePopup();
            }
        });
    }

    // Free Guide Form Submission
    const freeGuideForm = document.getElementById('free-guide-form');
    if (freeGuideForm) {
        freeGuideForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('free-guide-email').value;
            if (email) {
                console.log('Email captured:', email);
                localStorage.setItem('freeGuideEmail', email);
                hideFreeGuidePopup();
                alert('Thank you! Your free guide will be sent to your email.');
                freeGuideForm.reset();
            }
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            if (email) {
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            }
        });
    }

    // Mobile View Detection
    function isMobileDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'windows phone'];
        return mobileKeywords.some(keyword => userAgent.includes(keyword)) || window.innerWidth <= 767;
    }

    if (isMobileDevice()) {
        document.body.classList.add('mobile-view');
    }

    // Update Counts
    window.updateCounts = function() {
        const compareCount = document.getElementById('compare-count');
        const wishlistCount = document.getElementById('wishlist-count');
        const cartCount = document.getElementById('cart-count');

        const compare = JSON.parse(localStorage.getItem('compare')) || [];
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (compareCount) compareCount.textContent = `Compare (${compare.length})`;
        if (wishlistCount) wishlistCount.textContent = `Wishlist (${wishlist.length})`;
        if (cartCount) cartCount.textContent = `Cart (${cart.length})`;
    };
	
	const productGrid = document.getElementById('product-grid');
if (productGrid) {
    let productHTML = '';
    products.forEach(product => {
        productHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto;">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">ZMW ${product.price.toFixed(2)}</p>
                <p class="rating">${product.rating}</p>
                <button class="add-to-cart" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button>
                <button class="add-to-wishlist" data-product-id="${product.id}" aria-label="Add ${product.name} to wishlist"><i class="fas fa-heart"></i> Add to Wishlist</button>
            </div>
        `;
    });
    productGrid.innerHTML = productHTML;
}

    updateCounts();
});