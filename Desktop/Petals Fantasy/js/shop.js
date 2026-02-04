// Shop Page Logic
// Depends on data/products.js and js/api.js

class ShopController {
    constructor() {
        this.filters = {
            category: null,
            minPrice: 0,
            maxPrice: 10000,
            search: '',
            sort: 'newest'
        };
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.renderProducts();
    }

    bindEvents() {
        // Search
        const searchInput = document.getElementById('shopSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.renderProducts();
            });
        }

        // Category Filters
        const categoryInputs = document.querySelectorAll('input[name="category"]');
        categoryInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                // Uncheck others to behave like radio if needed, or support multi-select (advanced)
                // For now, let's support single category filter for simplicity like requested "Filter by..."
                if (e.target.checked) {
                    this.filters.category = e.target.value;
                    // Uncheck others
                    categoryInputs.forEach(i => { if (i !== e.target) i.checked = false; });
                } else {
                    this.filters.category = null;
                }
                this.renderProducts();
            });
        });

        // Price Input
        const priceRange = document.getElementById('priceRange');
        const priceValue = document.getElementById('priceValue');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.filters.maxPrice = parseInt(e.target.value);
                if (priceValue) priceValue.textContent = `Up to Rs. ${this.filters.maxPrice}`;
                this.renderProducts();
            });
        }

        // Sort
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.renderProducts();
            });
        }
    }

    async renderProducts() {
        const grid = document.getElementById('productGrid');
        if (!grid) return;

        // Loading State
        grid.innerHTML = '<div class="loading">Loading Collection...</div>';

        // Fetch Data
        const products = await API.getProducts(this.filters);

        // Render
        grid.innerHTML = '';

        if (products.length === 0) {
            grid.innerHTML = '<div class="no-results">No bouquets found matching your criteria.</div>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">Rs. ${product.price.toLocaleString()}</p>
                </div>
                <!-- Button Outside Info for Absolute Positioning / Slide Up Effect -->
                <button class="btn-sm" onclick="addToCartWrapper('${product.id}')">Add to Cart</button>
                ${product.rating >= 4.8 ? '<span class="badge">Best Seller</span>' : ''}
            `;
            grid.appendChild(card);
        });
    }
}

// Wrapper for global addToCart to work with dynamic IDs
// Wrapper for global addToCart to work with dynamic IDs
async function addToCartWrapper(productId) {
    // ID is a string (e.g. 'pf-001'), do not parse as int
    const product = await API.getProductById(productId);
    if (product) {
        addToCart(product); // uses global addToCart from script.js
    } else {
        console.error("Product not found:", productId);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productGrid')) {
        new ShopController();
    }
});
