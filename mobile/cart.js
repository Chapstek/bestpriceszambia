// Product Data (Simulated Database)
const products = [
    { id: 1, code: "ZMW29999", name: "Apple iPhone 15 Pro Max 256GB", price: 29999, description: "Platform OS iOS 17, upgradable to iOS 18.3.2 48 MP Front, 12 MP Back.", image: "iphones.png", rating: "★★★★★" },
    { id: 2, code: "ZMW450", name: "Book", price: 450, description: "Source Code : My Beginnings by Bill Gates 2025 Hardcover W/Dust-Jacket BRAND NEW", image: "source_code.png", rating: "★★★★★" },
    { id: 3, code: "ZMW5486", name: "Nike Sneakers", price: 5486, description: "Size 10.5 Nike SB Dunk Low Bart Simpson", image: "nike.png", rating: "★★★★★" },
    { id: 4, code: "ZMW6336", name: "CAT S62 Smartphones", price: 6336, description: "GSM + CDMA 4G Rugged 128GB Android 5.7", image: "CATS62.png", rating: "★★★★★" },
    { id: 5, code: "ZMW17325", name: "Louis Vuitton Handbags", price: 17325, description: "Louis Vuitton Leather Handbag PM", image: "louisv.png", rating: "★★★★★" },
    { id: 6, code: "ZMW3276", name: "G-Shocks", price: 3276, description: "Power Trainer Water-Resistant Digital Sport Watch - GBD-800UC-5", image: "GSHOCK1.png", rating: "★★★★★" },
    { id: 7, code: "ZMW4450", name: "G-Shocks", price: 4450, description: "Black Dial Sports Quartz 200M Men's Watch GA-2300-1A", image: "GSHOCK.png", rating: "★★★★★" }
];

// Load Cart Table
document.addEventListener('DOMContentLoaded', () => {
    const cartTable = document.getElementById('cart-table');
    const cartTotalElement = document.getElementById('cart-total');
    const proceedToCheckoutButton = document.getElementById('proceed-to-checkout'); // Checkout Button

    if (cartTable) {
        // Load cart from localStorage (now an array of objects with id and quantity)
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Convert old cart format (array of IDs) to new format (array of objects) if necessary
        if (cart.length > 0 && typeof cart[0] === 'number') {
            cart = cart.map(id => ({ id, quantity: 1 }));
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Filter products that are in the cart
        const cartItems = cart.map(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                return { ...product, quantity: cartItem.quantity };
            }
            return null;
        }).filter(item => item !== null);

        if (cartItems.length === 0) {
            cartTable.innerHTML = `
                <p>Your cart is empty.</p>
                <a href="products.html" class="continue-shopping">Continue Shopping</a>
            `;
            if (proceedToCheckoutButton) {
                proceedToCheckoutButton.style.display = "none"; // Hide Checkout Button if cart is empty
            }
            return;
        }

        let totalPrice = 0;
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Code</th>
                        <th>Price (ZMW)</th>
                        <th>Quantity</th>
                        <th>Subtotal (ZMW)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cartItems.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalPrice += subtotal;
            tableHTML += `
                <tr>
                    <td>
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                        ${item.name}
                    </td>
                    <td>${item.code}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" class="cart-quantity" data-product-id="${item.id}" value="${item.quantity}" min="1" aria-label="Quantity for ${item.name}">
                    </td>
                    <td>${subtotal.toFixed(2)}</td>
                    <td>
                        <button class="remove-from-cart" data-product-id="${item.id}" aria-label="Remove ${item.name} from cart">Remove</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
            <div class="cart-summary">
                <p><strong>Total Price: ZMW <span id="cart-total">${totalPrice.toFixed(2)}</span></strong></p>
            </div>
            <div class="cart-actions">
                <a href="products.html" class="continue-shopping">Continue Shopping</a>
                <a href="checkout.html" class="proceed-to-checkout" id="proceed-to-checkout">Proceed to Checkout</a>
            </div>
        `;

        cartTable.innerHTML = tableHTML;

        // Show Checkout Button
        if (proceedToCheckoutButton) {
            proceedToCheckoutButton.style.display = "block";
        }

        // Update Quantity
        document.querySelectorAll('.cart-quantity').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(input.getAttribute('data-product-id'));
                const newQuantity = parseInt(input.value);
                
                if (newQuantity < 1) {
                    input.value = 1;
                    return;
                }

                // Update cart in localStorage
                cart = cart.map(item => 
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                );
                localStorage.setItem('cart', JSON.stringify(cart));

                // Recalculate total price
                let newTotalPrice = 0;
                cart.forEach(cartItem => {
                    const product = products.find(p => p.id === cartItem.id);
                    if (product) {
                        newTotalPrice += product.price * cartItem.quantity;
                    }
                });
                updateTotalPrice(newTotalPrice);

                // Update subtotal for this row
                const row = input.closest('tr');
                const priceCell = row.cells[2]; // Price column
                const subtotalCell = row.cells[4]; // Subtotal column
                const price = parseFloat(priceCell.textContent);
                const subtotal = price * newQuantity;
                subtotalCell.textContent = subtotal.toFixed(2);
            });
        });

        // Remove from Cart
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                cart = cart.filter(item => item.id !== productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCounts();
                window.location.reload();
            });
        });
    }

    function updateTotalPrice(total) {
        if (cartTotalElement) {
            cartTotalElement.textContent = total.toFixed(2);
        }
    }

    // Proceed to Checkout Button Click Event
    const proceedButton = document.getElementById('proceed-to-checkout');
    if (proceedButton) {
        proceedButton.addEventListener('click', (event) => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert("Your cart is empty. Add products before proceeding to checkout.");
                event.preventDefault();
            } else {
                window.location.href = "checkout.html";
            }
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
        const navHome = document.getElementById('nav-home');
        if (navHome) navHome.classList.add('active');
    }

    // Highlight Current Page in Bottom Navigation
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
    if (bottomNavLinks) {
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        const bottomNavCart = document.getElementById('bottom-nav-cart');
        if (bottomNavCart) bottomNavCart.classList.add('active');
    }

    // Breadcrumb Navigation
    function updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const currentPage = window.location.pathname.split('/').pop();
            let navHistory = JSON.parse(sessionStorage.getItem('navHistory')) || [];

            if (!navHistory.some(item => item.url === currentPage)) {
                navHistory.push({ url: currentPage, title: 'Cart' });
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