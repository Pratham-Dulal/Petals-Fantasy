
// Main JavaScript for Himalaya Floriculture

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon/aria states here if needed
            const icon = mobileToggle.querySelector('i');
            if(icon) {
                 if(navLinks.classList.contains('active')) {
                     icon.classList.remove('fa-bars');
                     icon.classList.add('fa-times');
                 } else {
                     icon.classList.remove('fa-times');
                     icon.classList.add('fa-bars');
                 }
            }
        });
    }
}

// Sticky Header Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'var(--glass-bg)';
        }
    });
}
