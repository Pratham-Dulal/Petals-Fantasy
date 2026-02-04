
// Cart Logic
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('himalaya_cart')) || [];
    const tbody = document.getElementById('cart-body');
    const emptyMsg = document.getElementById('empty-msg');

    tbody.innerHTML = '';

    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price;

        const tr = document.createElement('tr');

        // Image logic (Custom or Standard)
        let imgSrc = item.image || 'assets/rose-stem.png'; // Fallback

        tr.innerHTML = `
            <td>
                <div class="item-preview">
                    <img src="${imgSrc}" class="item-img" alt="Product">
                    <div>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 0.85rem; color: #666;">${getItemDetails(item)}</div>
                    </div>
                </div>
            </td>
            <td>
                <div style="border: 1px solid #ccc; display: inline-flex; border-radius: 4px;">
                    <button style="border:none; background:none; padding: 5px 10px;">-</button>
                    <span style="padding: 5px 10px;">1</span>
                    <button style="border:none; background:none; padding: 5px 10px;">+</button>
                </div>
            </td>
            <td style="font-weight: 600;">Rs. ${item.price}</td>
            <td>
                <button onclick="removeItem(${index})" style="color: #ef4444; background: none; border: none; cursor: pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('subtotal').textContent = `Rs. ${subtotal}`;
    document.getElementById('total').textContent = `Rs. ${subtotal + 150}`;
}

function getItemDetails(item) {
    if (item.items) { // Custom Bouquet
        return `${item.items.length} Flowers, ${item.wrapper.type} wrap`;
    }
    return 'Standard Bundle';
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('himalaya_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('himalaya_cart', JSON.stringify(cart));
    loadCart();

    // Update badge if we were on other pages (mock update)
    const badge = document.querySelector('.badge');
    if (badge) badge.textContent = cart.length;
}
