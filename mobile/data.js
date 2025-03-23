// Shared Product Data
const products = [
    { id: 1, code: "ZMW29999", name: "Apple iPhone 15 Pro Max 256GB", price: 29999, description: "Platform OS iOS 17, upgradable to iOS 18.3.2 48 MP Front, 12 MP Back.", image: "iphones.png", rating: "★★★★★" },
    { id: 2, code: "ZMW450", name: "Book", price: 450, description: "Source Code : My Beginnings by Bill Gates 2025 Hardcover W/Dust-Jacket BRAND NEW", image: "source_code.png", rating: "★★★★★" },
    { id: 3, code: "ZMW5486", name: "Nike Sneakers", price: 5486, description: "Size 10.5 Nike SB Dunk Low Bart Simpson", image: "nike.png", rating: "★★★★★" },
    { id: 4, code: "ZMW6336", name: "CAT S62 Smartphones", price: 6336, description: "GSM + CDMA 4G Rugged 128GB Android 5.7", image: "CATS62.png", rating: "★★★★★" },
    { id: 5, code: "ZMW17325", name: "Louis Vuitton Handbags", price: 17325, description: "Louis Vuitton Leather Handbag PM", image: "louisv.png", rating: "★★★★★" },
    { id: 6, code: "ZMW3276", name: "G-Shocks", price: 3276, description: "Power Trainer Water-Resistant Digital Sport Watch - GBD-800UC-5", image: "GSHOCK1.png", rating: "★★★★★" },
    { id: 7, code: "ZMW4450", name: "G-Shocks", price: 4450, description: "Black Dial Sports Quartz 200M Men's Watch GA-2300-1A", image: "GSHOCK.png", rating: "★★★★★" }
];

// Function to update counts (shared across pages)
function updateCounts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const compare = JSON.parse(localStorage.getItem('compare')) || [];

    const cartCountElement = document.getElementById('cart-count');
    const wishlistCountElement = document.getElementById('wishlist-count');
    const compareCountElement = document.getElementById('compare-count');

    if (cartCountElement) {
        cartCountElement.textContent = `Cart (${cart.length})`;
    }
    if (wishlistCountElement) {
        wishlistCountElement.textContent = `Wishlist (${wishlist.length})`;
    }
    if (compareCountElement) {
        compareCountElement.textContent = `Compare (${compare.length})`;
    }
}