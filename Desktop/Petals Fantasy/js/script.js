// DOM Elements
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

// Mobile Menu
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// Global Modal & Toast Injection
document.body.insertAdjacentHTML('beforeend', `
    <!-- Cart Modal -->
    <div id="cartModal" class="modal">
        <div class="modal-content">
            <span class="close-modal" onclick="toggleModal('cartModal')">&times;</span>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                <h2 style="margin: 0; font-family: var(--font-heading);">Your Cart</h2>
                <button onclick="clearCart()" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">Discard All</button>
            </div>
            <div id="cartItems"></div>
            <div class="cart-summary" style="margin-top: 25px; border-top: 1px solid #eee; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; font-size: 1.2rem;">
                    <span>Total:</span>
                    <span>Rs. <span id="cartTotal">0</span></span>
                </div>
                <button class="btn" style="width: 100%;" onclick="openPayment()">Proceed to Checkout</button>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="toast-notification">
        <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
        <div class="toast-content">
            <h4>Added to Cart</h4>
            <p id="toastMessage">Product added successfully.</p>
        </div>
    </div>

    <!-- Payment Modal -->
    <div id="paymentModal" class="modal">
        <div class="modal-content">
            <span class="close-modal" onclick="toggleModal('paymentModal')">&times;</span>
            <h2>Select Payment Method</h2>
            <div class="payment-options">
                <div class="payment-option" onclick="selectPayment(this, 'Esewa')">
                    <i class="fas fa-wallet fa-2x"></i><br>Esewa
                </div>
                <div class="payment-option" onclick="selectPayment(this, 'Khalti')">
                    <i class="fas fa-file-invoice-dollar fa-2x"></i><br>Khalti
                </div>
                 <div class="payment-option" onclick="selectPayment(this, 'Bank')">
                    <i class="fas fa-university fa-2x"></i><br>Mobile Banking
                </div>
            </div>
            <button class="btn" style="width: 100%;" onclick="processPayment()">Pay Now</button>
        </div>
    </div>
    
    <!-- Lightbox -->
    <div id="lightbox" class="lightbox" onclick="closeLightbox()">
        <span class="close-lightbox" onclick="closeLightbox()">&times;</span>
        <img class="lightbox-content" id="lightboxImg">
    </div>
`);

// Cart Logic
let cart = JSON.parse(localStorage.getItem('petalsCart')) || [];
const cartCountEl = document.querySelector('.cart-count');

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = totalItems;

    // Update Modal
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 30px 0;">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item" style="display: flex; align-items: center; gap: 20px; padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                        <div style="width: 60px; height: 60px; border-radius: 4px; overflow: hidden; border: 1px solid #eee;">
                            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0; font-size: 1rem;">${item.name}</h4>
                            <p style="margin: 5px 0 0; color: #666; font-size: 0.9rem;">Rs. ${item.price.toLocaleString()} x ${item.quantity}</p>
                        </div>
                        <i class="fas fa-trash-alt" style="color: #ccc; cursor: pointer; transition: color 0.3s;" 
                           onmouseover="this.style.color='#ff4d4d'" 
                           onmouseout="this.style.color='#ccc'" 
                           onclick="removeFromCart(${index})"></i>
                    </div>
                `;
            });
        }
        cartTotalEl.textContent = total.toLocaleString();
    }
}

function clearCart() {
    if (confirm("Are you sure you want to discard all items?")) {
        cart = [];
        localStorage.setItem('petalsCart', JSON.stringify(cart));
        updateCartUI();
    }
}

function showToast(productName) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    if (toast && msg) {
        msg.textContent = `${productName} has been added.`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('petalsCart', JSON.stringify(cart));
    updateCartUI();
    // Show Toast
    showToast(product.name);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('petalsCart', JSON.stringify(cart));
    updateCartUI();
}

// Modal Logic
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = modal.style.display === "block" ? "none" : "block";
}

// Modify cart icon click to open modal instad of link
const cartIcons = document.querySelectorAll('.cart-icon');
cartIcons.forEach(icon => {
    icon.onclick = (e) => {
        e.preventDefault();
        updateCartUI();
        toggleModal('cartModal');
    };
});

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

// Payment Logic
function openPayment() {
    // Redirect to secure checkout page
    window.location.href = 'checkout.html';
}

let selectedPayment = null;
function selectPayment(el, method) {
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    selectedPayment = method;
}

function processPayment() {
    if (!selectedPayment) {
        alert("Please select a payment method.");
        return;
    }

    const amount = document.getElementById('cartTotal').textContent;
    alert(`Processing Payment of Rs. ${amount} via ${selectedPayment}...\n\nPayment Successful! Thank you for your order.`);

    cart = [];
    localStorage.setItem('petalsCart', JSON.stringify(cart));
    updateCartUI();
    toggleModal('paymentModal');
}

// Lightbox Logic for Gallery
document.querySelectorAll('.gallery-page img, .product-grid img').forEach(img => {
    // Only apply to gallery page content or specific gallery images
    if (window.location.pathname.includes('gallery.html')) {
        img.onclick = function () {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightboxImg');
            lightbox.style.display = "block";
            lightboxImg.src = this.src;
        }
    }
});

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
