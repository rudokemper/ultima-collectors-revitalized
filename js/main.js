const STORAGE_KEY = 'ultima_nav_toggle_states';

function getAllCategories() {
    return Array.from(document.querySelectorAll('[id^="cat-"]')).map(el => el.id);
}

function saveToggleStates() {
    const states = {};
    getAllCategories().forEach(categoryId => {
        const element = document.getElementById(categoryId);
        if (element) {
            states[categoryId] = element.style.display !== 'none';
        }
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

function restoreToggleStates() {
    const savedStates = sessionStorage.getItem(STORAGE_KEY);
    if (savedStates) {
        try {
            const states = JSON.parse(savedStates);
            Object.entries(states).forEach(([categoryId, isExpanded]) => {
                const content = document.getElementById(categoryId);
                const icon = document.getElementById('icon-' + categoryId);
                
                if (content && icon) {
                    if (isExpanded) {
                        content.style.display = 'block';
                        icon.classList.add('expanded');
                    } else {
                        content.style.display = 'none';
                        icon.classList.remove('expanded');
                    }
                }
            });
        } catch (e) {
            console.error('Error restoring toggle states:', e);
        }
    }
}

function toggleCategory(categoryId) {
    const content = document.getElementById(categoryId);
    const icon = document.getElementById('icon-' + categoryId);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.classList.add('expanded');
    } else {
        content.style.display = 'none';
        icon.classList.remove('expanded');
    }
    
    saveToggleStates();
}

function expandAll() {
    getAllCategories().forEach(categoryId => {
        const content = document.getElementById(categoryId);
        const icon = document.getElementById('icon-' + categoryId);
        
        if (content && icon) {
            content.style.display = 'block';
            icon.classList.add('expanded');
        }
    });
    saveToggleStates();
}

function collapseAll() {
    getAllCategories().forEach(categoryId => {
        const content = document.getElementById(categoryId);
        const icon = document.getElementById('icon-' + categoryId);
        
        if (content && icon) {
            content.style.display = 'none';
            icon.classList.remove('expanded');
        }
    });
    saveToggleStates();
}

function saveCurrentAnchor(anchorId) {
    sessionStorage.setItem('ultima_current_anchor', anchorId);
}

function restoreAnchorPosition() {
    const savedAnchor = sessionStorage.getItem('ultima_current_anchor');
    if (savedAnchor) {
        const element = document.getElementById(savedAnchor);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
        sessionStorage.removeItem('ultima_current_anchor');
    }
}

function loadPageInFrame(url) {
    const frame = document.getElementById('content-frame');
    if (frame) {
        frame.classList.add('loading');
        frame.src = url;
        
        frame.onload = function() {
            frame.classList.remove('loading');
        };
    }
}

function updateActiveLink(activeElement) {
    // Remove active class from all links
    document.querySelectorAll('.navigation a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    if (activeElement) {
        activeElement.classList.add('active');
    }
}

function isDesktop() {
    return window.innerWidth >= 1024;
}

function handleMapIndexClick(event) {
    // Allow right-click and middle-click to work normally (open in new tab)
    if (event.button !== 0) {
        return true;
    }
    
    // Only handle left-click
    if (isDesktop()) {
        // Prevent default navigation and load in iframe for desktop
        event.preventDefault();
        loadPageInFrame('maps.html');
        updateActiveLink(null);
    }
    // On mobile, let the default behavior happen (navigate to page)
}

window.addEventListener('load', function() {
    restoreToggleStates();
    restoreAnchorPosition();
    
    document.querySelectorAll('.navigation a[href^="pages/"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const listItem = this.parentElement;
            if (listItem && listItem.id) {
                saveCurrentAnchor(listItem.id);
            }
            
            // Handle desktop iframe navigation
            if (isDesktop()) {
                e.preventDefault();
                loadPageInFrame(this.href);
                updateActiveLink(this);
            }
            // On mobile, let the default behavior happen (navigate to page)
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // If switching from mobile to desktop, preserve current content
        if (isDesktop()) {
            const frame = document.getElementById('content-frame');
            const activeLink = document.querySelector('.navigation a.active');
            
            // Only reload if no content is currently loaded or if we have an active link
            if (!frame.src || frame.src.includes('about:blank')) {
                if (activeLink) {
                    loadPageInFrame(activeLink.href);
                } else {
                    loadPageInFrame('intro.html');
                }
            }
            // Otherwise, keep whatever is currently loaded (including map index)
        }
    });
});