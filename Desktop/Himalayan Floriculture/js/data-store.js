
// Default mock products to start with if storage is empty
const DEFAULT_PRODUCTS = [
    { id: 1, name: 'Classic Red Roses', price: 2500, category: 'Bouquet', image: 'assets/rose-bouquet.png', rating: 5, description: 'A timeless expression of love and passion. These deep red roses are hand-picked for their perfection and arranged to steal hearts.' },
    { id: 2, name: 'Sunny Delight', price: 1800, category: 'Bouquet', image: 'assets/sunflower-vase.png', rating: 4.5, description: 'Brighten up anyone\'s day with this cheerful arrangement of sunflowers. Guaranteed to bring a smile.' },
    { id: 3, name: 'Elegant Lilies', price: 3200, category: 'Bouquet', image: 'assets/lily-bouquet.png', rating: 5, description: 'Sophisticated and fragrant, these white lilies represent purity and devotion. Perfect for weddings or formal occasions.' },
    { id: 4, name: 'Snake Plant', price: 1200, category: 'Plant', image: 'https://images.unsplash.com/photo-1599598424935-7c09341b5597?q=80&w=2038&auto=format&fit=crop', rating: 4.8, description: 'A hardy indoor plant that purifies the air and requires minimal care. Ideal for busy plant lovers.' },
];

const STORAGE_KEY = 'himalaya_products';

// Load products from LocalStorage or return defaults
function loadProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Initialize storage with defaults so admin and shop stay in sync
        saveProducts(DEFAULT_PRODUCTS);
        return DEFAULT_PRODUCTS;
    }
    return JSON.parse(stored);
}

// Save products to LocalStorage
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Add a new product
function addProductToStore(product) {
    const products = loadProducts();
    products.push(product);
    saveProducts(products);
}

// Delete a product (optional, for admin)
function deleteProductFromStore(id) {
    const products = loadProducts();
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
}
