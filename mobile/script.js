// ============================================
// Hamburger / Mobile Navigation
// ============================================
function toggleMenu() {
    const nav = document.querySelector('.top-nav') || document.querySelector('header nav') || document.querySelector('nav');
    const overlay = document.querySelector('.nav-overlay');
    const hamburger = document.querySelector('.hamburger');
    if (!nav || !hamburger) return;

    const isExpanded = nav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active', isExpanded);
    document.body.classList.toggle('menu-open', isExpanded);
    hamburger.textContent = isExpanded ? '✕' : '☰';
    hamburger.setAttribute('aria-expanded', String(isExpanded));
}

// ============================================
// Free Guide Pop-Up
// ============================================
window.showFreeGuidePopup = function() {
    const modal = document.getElementById('free-guide-modal');
    if (modal && !sessionStorage.getItem('freeGuidePopupShown')) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        sessionStorage.setItem('freeGuidePopupShown', 'true');
        const emailInput = document.getElementById('free-guide-email');
        if (emailInput) emailInput.focus();
    }
};

window.hideFreeGuidePopup = function() {
    const modal = document.getElementById('free-guide-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
};

// ============================================
// DOMContentLoaded – shared setup
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when overlay is clicked
    const overlay = document.querySelector('.nav-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            const nav = document.querySelector('.top-nav') || document.querySelector('header nav');
            if (nav && nav.classList.contains('active')) toggleMenu();
        });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const nav = document.querySelector('.top-nav') || document.querySelector('header nav');
            if (nav && nav.classList.contains('active')) toggleMenu();
        }
    });

    // Free Guide Pop-Up (after 5 seconds)
    setTimeout(() => { showFreeGuidePopup(); }, 5000);

    const freeGuideModalClose = document.getElementById('free-guide-modal-close');
    if (freeGuideModalClose) {
        freeGuideModalClose.addEventListener('click', hideFreeGuidePopup);
    }

    const freeGuideModalDecline = document.getElementById('free-guide-modal-decline');
    if (freeGuideModalDecline) {
        freeGuideModalDecline.addEventListener('click', (e) => {
            e.preventDefault();
            hideFreeGuidePopup();
        });
    }

    const freeGuideModal = document.getElementById('free-guide-modal');
    if (freeGuideModal) {
        freeGuideModal.addEventListener('click', (e) => {
            if (e.target === freeGuideModal) hideFreeGuidePopup();
        });
    }

    const freeGuideForm = document.getElementById('free-guide-form');
    if (freeGuideForm) {
        freeGuideForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('free-guide-email').value;
            if (email) {
                localStorage.setItem('freeGuideEmail', email);
                hideFreeGuidePopup();
                alert('Thank you! Your free guide will be sent to your email.');
                freeGuideForm.reset();
            }
        });
    }

    // Newsletter Form
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

    // Update Counts helper (used by all pages)
    window.updateCounts = function() {
        const compare  = JSON.parse(localStorage.getItem('compare'))  || [];
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const cart     = JSON.parse(localStorage.getItem('cart'))     || [];

        const compareEl  = document.getElementById('compare-count');
        const wishlistEl = document.getElementById('wishlist-count');
        const cartEl     = document.getElementById('cart-count');

        if (compareEl)  compareEl.innerHTML  = `Compare (${compare.length})`;
        if (wishlistEl) wishlistEl.innerHTML = `Wishlist (${wishlist.length})`;
        if (cartEl)     cartEl.innerHTML     = `Cart (${cart.length})`;
    };
});