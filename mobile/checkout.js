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

// Load Cart Summary
document.addEventListener('DOMContentLoaded', () => {
    const cartSummaryTable = document.getElementById('cart-summary-table');
    const cartTotalElement = document.getElementById('cart-total');

    if (cartSummaryTable) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Map cart items to include product details and quantities
        const cartItems = cart.map(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                return { ...product, quantity: cartItem.quantity };
            }
            return null;
        }).filter(item => item !== null);

        if (cartItems.length === 0) {
            cartSummaryTable.innerHTML = '<p>Your cart is empty. Please add items to proceed.</p>';
            document.getElementById('place-order').disabled = true;
            return;
        }

        let totalPrice = 0;
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price (ZMW)</th>
                        <th>Quantity</th>
                        <th>Subtotal (ZMW)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cartItems.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalPrice += subtotal;
            tableHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${subtotal.toFixed(2)}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        cartSummaryTable.innerHTML = tableHTML;
        if (cartTotalElement) {
            cartTotalElement.textContent = totalPrice.toFixed(2);
        }
    }

    // Checkout Form Submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const placeOrderButton = document.getElementById('place-order');
            placeOrderButton.disabled = true; // Disable button to prevent multiple submissions

            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const paymentMethod = document.getElementById('payment-method').value;
            const totalPrice = cartTotalElement ? parseFloat(cartTotalElement.textContent) : 0;

            if (!paymentMethod) {
                alert('Please select a payment method.');
                placeOrderButton.disabled = false;
                return;
            }

            // Configure Flutterwave payment
            const paymentOptions = paymentMethod === 'card' ? ['card'] : ['mobilemoneyzambia'];

            FlutterwaveCheckout({
                public_key: 'FLWPUBK_TEST-your-public-key-here-X', // Replace with your Flutterwave public key
                tx_ref: `B2BFT-${Date.now()}`, // Unique transaction reference
                amount: totalPrice,
                currency: 'ZMW',
                payment_options: paymentOptions.join(','), // e.g., 'card' or 'mobilemoneyzambia'
                customer: {
                    email: email,
                    phone_number: phone,
                    name: fullName,
                },
                customizations: {
                    title: 'B2B Flooring Trader',
                    description: 'Payment for your order',
                    logo: 'https://your-site.com/logo.png', // Replace with your logo URL
                },
                callback: async (response) => {
                    if (response.status === 'successful') {
                        // Send transaction details to your backend for verification and order logging
                        try {
                            const verifyResponse = await fetch('https://your-backend-server.com/verify-payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    transactionId: response.transaction_id,
                                    txRef: response.tx_ref,
                                    amount: totalPrice,
                                    currency: 'ZMW',
                                    customer: {
                                        name: fullName,
                                        email: email,
                                        phone: phone,
                                        address: address,
                                    },
                                    cart: JSON.parse(localStorage.getItem('cart')) || [],
                                }),
                            });

                            const verifyResult = await verifyResponse.json();
                            if (verifyResult.success) {
                                // Clear the cart and redirect to confirmation page
                                localStorage.setItem('cart', JSON.stringify([]));
                                updateCounts();
                                window.location.href = 'confirmation.html';
                            } else {
                                alert('Payment verification failed. Please contact support.');
                                placeOrderButton.disabled = false;
                            }
                        } catch (err) {
                            alert('An error occurred while verifying your payment. Please contact support.');
                            placeOrderButton.disabled = false;
                        }
                    } else {
                        alert('Payment failed. Please try again.');
                        placeOrderButton.disabled = false;
                    }
                },
                onclose: () => {
                    placeOrderButton.disabled = false; // Re-enable button if user closes the payment modal
                },
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
                navHistory.push({ url: currentPage, title: 'Checkout' });
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