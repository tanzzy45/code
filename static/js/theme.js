document.addEventListener('DOMContentLoaded', function() {
    // For checking saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon visibility
            if (newTheme === 'dark') {
                document.querySelector('.fa-moon').style.display = 'none';
                document.querySelector('.fa-sun').style.display = 'inline';
            } else {
                document.querySelector('.fa-moon').style.display = 'inline';
                document.querySelector('.fa-sun').style.display = 'none';
            }
            
            // Close filter dropdown if open when changing theme
            const filterDropdown = document.getElementById('filter-dropdown');
            if (filterDropdown && filterDropdown.classList.contains('active')) {
                filterDropdown.classList.remove('active');
                filterDropdown.classList.add('hidden');
            }
        });
        
        // Set initial icon state
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.querySelector('.fa-moon').style.display = 'none';
            document.querySelector('.fa-sun').style.display = 'inline';
        } else {
            document.querySelector('.fa-moon').style.display = 'inline';
            document.querySelector('.fa-sun').style.display = 'none';
        }
    }

    // Hide loading screen when page is fully loaded
    window.addEventListener('load', function() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    });
    
    // Show loading screen on navigation
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a, button[type="submit"]');
        if (target && 
            !e.ctrlKey && !e.metaKey && 
            !target.getAttribute('target') && 
            target.getAttribute('href') !== '#' && 
            !target.classList.contains('filter-toggle') && 
            !target.closest('#theme-toggle')) { 
            
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
            }
        }
    });

    // Show loading on form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function() {
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
            }
        });
    }
});