// Universal Home link fix - always navigate to top-level window
// This prevents iframe-in-iframe situations and ensures Home always goes to the main page

(function() {
    'use strict';
    
    // Function to handle home link clicks
    function handleHomeClick(event) {
        event.preventDefault();
        
        // Determine the correct path to index.html based on current location
        var homePath = 'index.html';
        
        // If we're in a subdirectory (like pages/), we need to go up one level
        if (window.location.pathname.includes('/pages/')) {
            homePath = '../index.html';
        }
        
        // Always navigate the top-level window to the home page
        window.top.location.href = homePath;
    }
    
    // Wait for DOM to be ready
    function initializeHomeFix() {
        // Find all breadcrumb home links
        const homeLinks = document.querySelectorAll('.breadcrumb a[href*="index.html"]');
        
        homeLinks.forEach(function(link) {
            // Add click event listener to each home link
            link.addEventListener('click', handleHomeClick);
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHomeFix);
    } else {
        initializeHomeFix();
    }
})();
