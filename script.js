// Peninsula Website Interactive Features

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeNotch();
    initializeFAQ();
    fetchLatestVersion();
    initializeScrollAnimations();
});

// Notch interaction (HOVER-BASED, matching the actual app!)
function initializeNotch() {
    const notch = document.getElementById('notch');
    if (!notch) return;

    let hoverTimeout;
    let closeTimeout;

    // Hover to open (matches app's 0.3s hover timer)
    notch.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);

        // Auto-open after 0.3s hover (matches app)
        hoverTimeout = setTimeout(() => {
            notch.classList.add('open');
        }, 300);
    });

    // Mouse leave to close
    notch.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);

        // Close when mouse leaves
        closeTimeout = setTimeout(() => {
            notch.classList.remove('open');
        }, 100);
    });

    // Also allow click to toggle (bonus interaction)
    notch.addEventListener('click', () => {
        clearTimeout(hoverTimeout);
        clearTimeout(closeTimeout);
        notch.classList.toggle('open');

        // Auto-close after 3s if clicked open
        if (notch.classList.contains('open')) {
            closeTimeout = setTimeout(() => {
                notch.classList.remove('open');
            }, 3000);
        }
    });

    // Close on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            notch.classList.remove('open');
            clearTimeout(hoverTimeout);
            clearTimeout(closeTimeout);
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// FAQ accordion
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Fetch latest version from appcast.xml
function fetchLatestVersion() {
    const versionElement = document.getElementById('latest-version');
    if (!versionElement) return;

    fetch('appcast.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'text/xml');
            const items = xml.querySelectorAll('item');

            if (items.length > 0) {
                const latestTitle = items[0].querySelector('title').textContent;
                const version = latestTitle.replace('Peninsula ', '');
                versionElement.textContent = version;

                // Add subtle animation
                versionElement.style.opacity = '0';
                setTimeout(() => {
                    versionElement.style.transition = 'opacity 0.5s ease';
                    versionElement.style.opacity = '1';
                }, 100);
            }
        })
        .catch(error => {
            console.error('Error fetching version:', error);
            versionElement.textContent = '1.0.4';
        });
}

// Scroll animations with Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards for staggered animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

        observer.observe(card);
    });

    // Observe steps for staggered animation
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-30px)';
        step.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;

        observer.observe(step);
    });

    // Observe requirement cards
    const requirementCards = document.querySelectorAll('.requirement-card');
    requirementCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;

        observer.observe(card);
    });
}

// Add visible class style dynamically
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) translateX(0) scale(1) !important;
    }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add subtle parallax effect to gradient background
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const gradientBg = document.querySelector('.gradient-bg');

            if (gradientBg) {
                gradientBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }

            ticking = false;
        });

        ticking = true;
    }
}, { passive: true });

// Enhanced button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--x', `${x}px`);
        this.style.setProperty('--y', `${y}px`);
    });
});

// Log Peninsula ASCII art to console
console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║         🌊 Peninsula v1.0.4 🌊        ║
    ║                                       ║
    ║   Transform your MacBook notch into   ║
    ║      a powerful productivity tool     ║
    ║                                       ║
    ║   https://getpeninsula.com            ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
`);
