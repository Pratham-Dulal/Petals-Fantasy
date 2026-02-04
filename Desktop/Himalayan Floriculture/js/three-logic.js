import * as THREE from './three.js';
import { OrbitControls } from './OrbitControls.js';

// --- State & Config ---
const state = {
    flowers: [],
    wrapper: { type: 'kraft', price: 200 },
    addons: [],
    cardText: ''
};

const flowerAssets = {
    'rose': 'assets/rose-stem.png',
    'lily': 'assets/lily-stem.png',
    'sunflower': 'assets/sunflower-stem.png', // Fallback handled by texture loader
    'filler': 'assets/filler-stem.png'
};

const wrapperColors = {
    'kraft': 0xd4a373,
    'pink': 0xfce7f3,
    'black': 0x333333
};

// --- Scene Setup ---
const canvasContainer = document.getElementById('bouquet-stage');
const width = canvasContainer.clientWidth;
const height = canvasContainer.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Dark studio background

const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
canvasContainer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// --- Base/Wrapper Geometry ---
// A cone to represent the wrapped bouquet base
const wrapperGeo = new THREE.ConeGeometry(1.5, 4, 32, 1, true);
const wrapperMat = new THREE.MeshStandardMaterial({
    color: wrapperColors['kraft'],
    side: THREE.DoubleSide,
    roughness: 0.8
});
const wrapperMesh = new THREE.Mesh(wrapperGeo, wrapperMat);
wrapperMesh.rotation.x = Math.PI; // Flip upside down
wrapperMesh.position.y = 2;
scene.add(wrapperMesh);

// --- Texture Loader ---
const loader = new THREE.TextureLoader();

// --- 3D Message Card ---
let cardMesh = null;
const cardCanvas = document.createElement('canvas');
cardCanvas.width = 512;
cardCanvas.height = 256;
const cardCtx = cardCanvas.getContext('2d');

function createCardTexture(text) {
    // Background
    cardCtx.fillStyle = '#ffffff';
    cardCtx.fillRect(0, 0, 512, 256);
    cardCtx.strokeStyle = '#d4af37';
    cardCtx.lineWidth = 10;
    cardCtx.strokeRect(10, 10, 492, 236);

    // Text
    cardCtx.fillStyle = '#000000';
    cardCtx.font = '40px "Playfair Display", serif';
    cardCtx.textAlign = 'center';
    cardCtx.textBaseline = 'middle';

    // Simple wrap logic (very basic)
    const lines = text.split('\n');
    let y = 128 - ((lines.length - 1) * 25);

    if (text.trim() === '') {
        cardCtx.fillStyle = '#cccccc';
        cardCtx.fillText("Your Message Here", 256, 128);
    } else {
        lines.forEach(line => {
            cardCtx.fillText(line, 256, y);
            y += 50;
        });
    }

    const texture = new THREE.CanvasTexture(cardCanvas);
    return texture;
}

// --- Exposed Functions ---

window.builder = {
    addFlower: (type, price) => {
        // Add to state
        const id = Date.now();
        state.flowers.push({ id, type, price });
        updateSummary();

        // Load correct texture or fallback
        const path = flowerAssets[type] || 'assets/rose-stem.png';

        loader.load(path, (texture) => {
            // Billboard (Sprite) Logic
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);

            // Randomize position in a "bunch" at the top of the wrapper
            const radius = 1.2;
            const x = (Math.random() - 0.5) * radius * 2;
            const z = (Math.random() - 0.5) * radius * 2;
            // Higher y for flowers peeking out
            const y = 3.5 + Math.random() * 1.5;

            sprite.position.set(x, y, z);

            // Scale appropriately (assuming tall stems)
            sprite.scale.set(3, 3, 1);
            // Sprites automatically face camera, giving 3D volume illusion

            sprite.userData = { id: id, type: 'flower' };
            scene.add(sprite);
        });
    },

    setWrapper: (type, price) => {
        state.wrapper = { type, price };
        updateSummary();

        // Update DOM active class
        document.querySelectorAll('#step-wrapping .option-card').forEach(c => c.classList.remove('selected'));
        // (Simplified DOM selection logic - in real app pass element)

        // Update 3D Color
        const color = wrapperColors[type] || 0xffffff;
        wrapperMesh.material.color.setHex(color);
    },

    toggleAddon: (type, price) => {
        // Check if exists
        const idx = state.addons.findIndex(a => a.type === type);

        if (idx !== -1) {
            // Remove
            state.addons.splice(idx, 1);
            if (type === 'card' && cardMesh) {
                scene.remove(cardMesh);
                cardMesh = null;
            }
        } else {
            // Add
            state.addons.push({ type, price });
            if (type === 'card') {
                const geometry = new THREE.PlaneGeometry(1.5, 0.75); // Business card aspect
                const texture = createCardTexture(state.cardText);
                const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                cardMesh = new THREE.Mesh(geometry, material);

                // Position sticking out of bouquet
                cardMesh.position.set(0.8, 4, 1.2);
                cardMesh.rotation.y = -Math.PI / 6;
                scene.add(cardMesh);
            }
        }
        updateSummary();
    },

    updateCardText: (text) => {
        state.cardText = text;
        if (cardMesh) {
            const newTexture = createCardTexture(text);
            cardMesh.material.map = newTexture;
            cardMesh.material.needsUpdate = true;
        }
    },

    clearCanvas: () => {
        // Clear State
        state.flowers = [];
        state.addons = [];
        state.cardText = '';
        state.wrapper = { type: 'kraft', price: 200 };
        document.getElementById('card-text').value = '';

        // Clear Scene Helper
        for (let i = scene.children.length - 1; i >= 0; i--) {
            const obj = scene.children[i];
            // Don't remove lights or base wrapper
            if (obj.userData.type === 'flower' || obj === cardMesh) {
                scene.remove(obj);
            }
        }
        cardMesh = null;

        // Reset Wrapper Color
        wrapperMesh.material.color.setHex(wrapperColors['kraft']);

        updateSummary();
    }
};

// --- Helpers ---
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

// Re-bind Add to Cart to use this state (overwrite builder.js listener)
const addToCartBtn = document.getElementById('add-to-cart-btn');
if (addToCartBtn) {
    // Clone to remove old listeners
    const newBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);

    newBtn.addEventListener('click', () => {
        const bouquet = {
            id: Date.now(),
            name: 'Custom 3D Bouquet', // Updated name
            items: state.flowers,
            wrapper: state.wrapper,
            addons: state.addons,
            price: parseInt(document.getElementById('total-price').textContent.replace('Rs. ', ''))
        };

        let cart = JSON.parse(localStorage.getItem('himalaya_cart')) || [];
        cart.push(bouquet);
        localStorage.setItem('himalaya_cart', JSON.stringify(cart));

        alert('3D Bouquet added to cart!');
        window.location.href = 'cart.html';
    });
}


// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Optional: Gently rotate the bouquet
    // wrapperMesh.rotation.y += 0.001; 

    renderer.render(scene, camera);
}

// Handle Resize
window.addEventListener('resize', () => {
    const w = canvasContainer.clientWidth;
    const h = canvasContainer.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});

animate();
