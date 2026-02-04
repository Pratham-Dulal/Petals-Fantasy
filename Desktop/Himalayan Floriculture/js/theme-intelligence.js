
// Theme Intelligence Logic

const themes = {
    'love': {
        label: 'Love & Romance',
        description: 'Red symbolizes passion and deep affection.',
        recommendations: ['rose'], // Red Rose
        colorHex: '#e11d48',
        guidance: "For love, red roses are the classic choice. Odd numbers (3, 5, 7) are often considered lucky or artistically balanced."
    },
    'friendship': {
        label: 'Friendship & Joy',
        description: 'Yellow represents happiness, optimism, and platonic love.',
        recommendations: ['sunflower'], // Yellow
        colorHex: '#fcd34d',
        guidance: "Sunflowers radiate positivity. A mix of 3 sunflowers with greenery creates a vibrant, cheerful bundle."
    },
    'sympathy': {
        label: 'Sympathy & Peace',
        description: 'White signifies purity, reverence, and condolences.',
        recommendations: ['lily'], // White Lily
        colorHex: '#f3f4f6',
        guidance: "White lilies are elegant and soothing. Keep the arrangement simple and dignified."
    },
    'gratitude': {
        label: 'Gratitude & Appreciation',
        description: 'Pink conveys gentleness, grace, and heartfelt thanks.',
        recommendations: ['rose', 'lily'], // Pink (we can use Pink wrapper + White/Red mix or just imply)
        colorHex: '#fbcfe8',
        guidance: "Soft colors like pinks and whites express sincere gratitude. Consider a lush bouquet with plenty of fillers."
    },
    'custom': {
        label: 'My Own Imagination',
        description: 'Trust your creativity. Build whatever feels right!',
        recommendations: [],
        colorHex: '#d4af37',
        guidance: "There are no rules here. Mix and match to create something unique."
    }
};

let currentTheme = null;

// Initialize Modal
document.addEventListener('DOMContentLoaded', () => {
    showThemeModal();
});

function showThemeModal() {
    // Check if we already selected (optional, for now always show on reload for demo)
    // if(sessionStorage.getItem('theme')) return;

    const modal = document.createElement('div');
    modal.id = 'theme-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.style.backdropFilter = 'blur(5px)';

    let contentHtml = `
        <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 600px; width: 90%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <h2 style="font-family: 'Playfair Display', serif; color: #1a472a; margin-bottom: 0.5rem;">What is the Occasion?</h2>
            <p style="color: #666; margin-bottom: 2rem;">Let us suggest the perfect blooms based on the psychology of flowers.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
    `;

    for (const [key, theme] of Object.entries(themes)) {
        contentHtml += `
            <button onclick="selectTheme('${key}')" class="theme-btn" style="
                padding: 1rem; 
                border: 2px solid ${theme.colorHex}; 
                background: white; 
                border-radius: 0.5rem; 
                cursor: pointer; 
                transition: all 0.2s;
                display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;
            " onmouseover="this.style.background='${theme.colorHex}33'" onmouseout="this.style.background='white'">
                <span style="font-weight: 600; color: #333;">${theme.label}</span>
                <span style="font-size: 0.75rem; color: #777;">${theme.recommendations.length > 0 ? 'Recommends: ' + theme.recommendations.join(', ') : 'Free Flow'}</span>
            </button>
        `;
    }

    contentHtml += `
            </div>
            <p style="font-size: 0.8rem; color: #999;">Select an option to start customization.</p>
        </div>
    `;

    modal.innerHTML = contentHtml;
    document.body.appendChild(modal);
}

window.selectTheme = function (key) {
    currentTheme = themes[key];

    // Remove Modal
    const modal = document.getElementById('theme-modal');
    if (modal) modal.remove();

    // Apply UI Feedback
    applyThemeUI();

    // Show Guidance Toast
    showToast(currentTheme.guidance);
};

function applyThemeUI() {
    if (!currentTheme) return;

    // Highlight recommended flowers in the sidebar
    document.querySelectorAll('.option-card').forEach(card => {
        // Reset
        card.style.borderColor = '#eee';
        card.querySelector('.rec-badge')?.remove();

        // Check recommendation (naive check by text content or id if we had it)
        const text = card.querySelector('h4').textContent.toLowerCase();
        const type = currentTheme.recommendations.find(rec => text.includes(rec)); // rose matches Red Rose

        if (type) {
            card.style.borderColor = currentTheme.colorHex;
            card.style.boxShadow = `0 0 10px ${currentTheme.colorHex}40`;

            const badge = document.createElement('div');
            badge.className = 'rec-badge';
            badge.textContent = 'Recommended';
            badge.style.position = 'absolute';
            badge.style.top = '-10px';
            badge.style.left = '50%';
            badge.style.transform = 'translateX(-50%)';
            badge.style.backgroundColor = currentTheme.colorHex;
            badge.style.color = 'white';
            badge.style.fontSize = '0.7rem';
            badge.style.padding = '2px 8px';
            badge.style.borderRadius = '10px';
            badge.style.fontWeight = 'bold';
            card.style.position = 'relative';
            card.appendChild(badge);
        }
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '100px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#1a472a';
    toast.style.color = 'white';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '2rem';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    toast.style.zIndex = '1000';
    toast.style.animation = 'fadeInUp 0.5s ease-out';

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}
