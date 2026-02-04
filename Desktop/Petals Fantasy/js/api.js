// API Service Layer
// Uses the global PRODUCTS_DB simulated variable

const API = {
    // Simulate network delay for realism
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    async getProducts(filters = {}) {
        await this.delay(300); // 300ms simulated latency

        let results = [...PRODUCTS_DB];

        // Filtering
        if (filters.category) {
            results = results.filter(p => p.category === filters.category);
        }

        if (filters.minPrice) {
            results = results.filter(p => p.price >= filters.minPrice);
        }

        if (filters.maxPrice) {
            results = results.filter(p => p.price <= filters.maxPrice);
        }

        if (filters.search) {
            const term = filters.search.toLowerCase();
            results = results.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.tags.some(t => t.toLowerCase().includes(term))
            );
        }

        // Sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'price-low':
                    results.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    results.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    results.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    // Default to ID/Newest
                    break;
            }
        }

        return results;
    },

    async getProductById(id) {
        await this.delay(100);
        return PRODUCTS_DB.find(p => p.id === id);
    },

    async getFeaturedProducts() {
        await this.delay(200);
        // Return top 4 rated products
        return [...PRODUCTS_DB].sort((a, b) => b.rating - a.rating).slice(0, 4);
    }
};
