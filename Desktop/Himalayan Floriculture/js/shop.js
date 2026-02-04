
// Product Database (Loaded from shared store)
let products = [];

document.addEventListener('DOMContentLoaded', () => {
    // Load products from shared store
    products = loadProducts();

    // Get params
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat') || 'all';

    // Update Title
    const titleMap = {
        'all': 'All Flowers',
        'birthday': 'Birthday Blooms',
        'anniversary': 'Anniversary Specials',
        'wedding': 'Wedding Collection',
        'sympathy': 'Sympathy Flowers'
    };
    document.getElementById('page-title').textContent = titleMap[category] || 'Shop';

    // Filter Products
    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category.toLowerCase() === category);

    renderProducts(filtered);
    updateActiveFilter(category);
});

function renderProducts(items) {
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p>No products found in this category.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.image || 'assets/placeholder.png'}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300?text=No+Image'">
                <button class="wishlist-btn"><i class="fa-regular fa-heart"></i></button>
                <div class="product-overlay">
                    <button class="btn btn-primary btn-sm" onclick="addToCartMock(${product.id}, '${product.name}', ${product.price}, '${product.image || ''}')">Add to Cart</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">Rs. ${product.price}</div>
                <div class="rating">
                    ${getStars(product.rating)}
                </div>
                ${product.description ? `<p class="product-story" style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${product.description}</p>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

function getStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars += '<i class="fa-solid fa-star"></i>';
        else if (i - 0.5 === rating) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        else stars += '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

function updateActiveFilter(current) {
    document.querySelectorAll('.filter-link').forEach(link => {
        link.classList.remove('active');
        if (link.href.includes(`cat=${current}`)) {
            link.classList.add('active');
            link.style.fontWeight = '700';
            link.style.color = 'var(--color-primary)';
        }
    });
}

// Add to Cart Mock (reuse builder logic roughly or simple push)
function addToCartMock(id, name, price, image) {
    const item = {
        id: Date.now(),
        name: name,
        price: price,
        image: image,
        items: null // Indicates standard product
    };

    let cart = JSON.parse(localStorage.getItem('himalaya_cart')) || [];
    cart.push(item);
    localStorage.setItem('himalaya_cart', JSON.stringify(cart));

    alert(`${name} added to cart!`);
    // Badge update logic normally here
}
