// Peninsula Website - Clean, Modular JavaScript

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeFeatureSelector();
    initializeUIToggle();
    initializeFAQ();
    fetchLatestVersion();
});

// ==========================================================================
// FEATURE SELECTOR (Left-Right Layout)
// ==========================================================================

function initializeFeatureSelector() {
    const featureItems = document.querySelectorAll('.feature-item');
    const featureContents = document.querySelectorAll('.feature-content');

    featureItems.forEach(item => {
        item.addEventListener('click', () => {
            const featureName = item.dataset.feature;

            // Remove active class from all items
            featureItems.forEach(i => i.classList.remove('active'));
            featureContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked item and corresponding content
            item.classList.add('active');
            const targetContent = document.querySelector(`.feature-content[data-feature="${featureName}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// UI STYLE TOGGLE
// ==========================================================================

function initializeUIToggle() {
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const uiContents = document.querySelectorAll('.ui-content');

    toggleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const styleName = option.dataset.style;

            // Remove active class from all options
            toggleOptions.forEach(o => o.classList.remove('active'));
            uiContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked option and corresponding content
            option.classList.add('active');
            const targetContent = document.querySelector(`.ui-content[data-style="${styleName}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// FAQ ACCORDION
// ==========================================================================

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// VERSION FETCHER
// ==========================================================================

function fetchLatestVersion() {
    const versionElement = document.getElementById('latest-version');
    if (!versionElement) return;

    fetch('appcast.xml')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch appcast');
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'text/xml');

            // Check for XML parsing errors
            const parserError = xml.querySelector('parsererror');
            if (parserError) throw new Error('XML parsing failed');

            // Get first item (latest version)
            const items = xml.querySelectorAll('item');
            if (items.length === 0) throw new Error('No versions found');

            // Try to get version from sparkle:shortVersionString, fallback to title
            const latestItem = items[0];
            let version = latestItem.querySelector('shortVersionString')?.textContent;

            if (!version) {
                const title = latestItem.querySelector('title')?.textContent;
                version = title ? title.replace('Peninsula ', '') : null;
            }

            if (version) {
                versionElement.textContent = version;
            } else {
                throw new Error('Version not found in appcast');
            }
        })
        .catch(error => {
            console.error('Error fetching version:', error);
            // Fallback to hardcoded version
            versionElement.textContent = '1.0.6';
        });
}

// ==========================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================================================

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
