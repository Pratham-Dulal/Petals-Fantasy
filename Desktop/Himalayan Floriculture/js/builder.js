
// Builder State
let state = {
    flowers: [],
    wrapper: { type: 'kraft', price: 200 },
    addons: [],
    totalPrice: 200
};

const flowerAssets = {
    'rose': 'assets/rose-stem.png',
    'lily': 'assets/lily-stem.png',
    'sunflower': '',
    'filler': ''
};

// Add Flower to Canvas
function addFlower(type, price) {
    const id = Date.now();

    // Randomize position slightly for natural look
    const randomRotation = Math.random() * 40 - 20; // -20 to 20 deg
    const randomX = Math.random() * 60 - 30; // -30 to 30 px offset
    const randomZ = Math.floor(Math.random() * 10);

    const flower = {
        id,
        type,
        price,
        rotation: randomRotation,
        offsetX: randomX,
        zIndex: randomZ
    };

    state.flowers.push(flower);
    renderFlower(flower);
    updateSummary();
}

// Render a single flower node
function renderFlower(flower) {
    const stage = document.getElementById('bouquet-stage');
    const el = document.createElement('div');
    el.className = 'flower-node';
    el.id = `flower-${flower.id}`;

    // Style positioning
    el.style.bottom = '150px'; // Above wrapper
    el.style.left = `calc(50% - 60px + ${flower.offsetX}px)`;
    el.style.transform = `rotate(${flower.rotation}deg)`;
    el.style.zIndex = flower.zIndex;

    // Image Content
    if (flowerAssets[flower.type]) {
        const img = document.createElement('img');
        img.src = flowerAssets[flower.type];
        el.appendChild(img);
    } else {
        // Fallback or Colored Box
        const box = document.createElement('div');
        box.style.width = '100%';
        box.style.height = '100%';
        box.style.borderRadius = '50%';
        box.style.background = flower.type === 'sunflower' ? '#fcd34d' : '#a7f3d0';
        box.style.border = '2px solid white';
        box.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        el.appendChild(box);
    }

    // Click to remove
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFlower(flower.id);
    });

    stage.appendChild(el);
}

// Remove Flower
function removeFlower(id) {
    state.flowers = state.flowers.filter(f => f.id !== id);
    const el = document.getElementById(`flower-${id}`);
    if (el) el.remove();
    updateSummary();
}

// Set Wrapper
function setWrapper(type, price) {
    state.wrapper = { type, price };

    // Update active UI (simplified)
    document.querySelectorAll('#step-wrapping .option-card').forEach(card => card.classList.remove('selected'));
    // In a real app we'd toggle the specific card, here just a logic placeholder

    updateSummary();
}

// Toggle Addon
function toggleAddon(type, price) {
    const exists = state.addons.find(a => a.type === type);
    if (exists) {
        state.addons = state.addons.filter(a => a.type !== type);
    } else {
        state.addons.push({ type, price });
    }
    updateSummary();
}

// Clear Canvas
function clearCanvas() {
    state.flowers = [];
    state.addons = [];
    document.getElementById('bouquet-stage').innerHTML = '';
    updateSummary();
}

// Update Prices
function updateSummary() {
    const flowerTotal = state.flowers.reduce((sum, f) => sum + f.price, 0);
    const addonTotal = state.addons.reduce((sum, a) => sum + a.price, 0);
    const total = state.wrapper.price + flowerTotal + addonTotal;

    document.getElementById('base-price').textContent = `Rs. ${state.wrapper.price}`;
    document.getElementById('flower-count').textContent = state.flowers.length;
    document.getElementById('flower-price').textContent = `Rs. ${flowerTotal}`;
    document.getElementById('addon-price').textContent = `Rs. ${addonTotal}`;
    document.getElementById('total-price').textContent = `Rs. ${total}`;
}

// Add to Cart Logic
document.querySelector('.builder-summary .btn-primary').addEventListener('click', () => {
    const bouquet = {
        id: Date.now(),
        name: 'Custom Bouquet',
        items: state.flowers,
        wrapper: state.wrapper,
        addons: state.addons,
        price: parseInt(document.getElementById('total-price').textContent.replace('Rs. ', ''))
    };

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('himalaya_cart')) || [];
    cart.push(bouquet);
    localStorage.setItem('himalaya_cart', JSON.stringify(cart));

    // Animate or alert
    alert('Bouquet added to cart!');
    window.location.href = 'cart.html';
});
