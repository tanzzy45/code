document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    const searchContainer = document.querySelector('.search-container');

    if (searchInput && searchInput.value.trim() !== '') {
        if (searchContainer) {
            searchContainer.classList.add('search-active');
            console.log('Added search-active class'); 
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();

            if (!searchSuggestions) return;

            if (query.length < 2) {
                searchSuggestions.classList.remove('active');
                searchSuggestions.innerHTML = '';
                return;
            }

            // Sample search suggestions
            const popularSearches = {
                'phone': ['iPhone 13', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'],
                'laptop': ['MacBook Pro', 'Dell XPS', 'HP Spectre', 'Lenovo ThinkPad'],
                'headphone': ['Sony WH-1000XM4', 'Apple AirPods Pro', 'Bose QuietComfort'],
                'shoe': ['Nike Air Max', 'Adidas Ultraboost', 'New Balance 990'],
                'watch': ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin Forerunner'],
                'camera': ['Canon EOS', 'Sony Alpha', 'Nikon Z6'],
                'book': ['Best selling novels', 'Self-help books', 'Children\'s books']
            };

            let matches = [];
            for (const key in popularSearches) {
                if (query.includes(key)) {
                    matches = [...matches, ...popularSearches[key]];
                }
            }

            matches.push(`Best ${query} under $100`);
            matches.push(`${query} with highest ratings`);
            matches.push(`Discount ${query}`);

            matches = [...new Set(matches)].slice(0, 5);

            if (matches.length > 0) {
                searchSuggestions.innerHTML = '';
                matches.forEach(suggestion => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    item.textContent = suggestion;

                    item.addEventListener('click', function() {
                        searchInput.value = suggestion;
                        searchSuggestions.classList.remove('active');
                        if (searchInput.form) {
                            searchInput.form.submit();
                        }
                    });

                    searchSuggestions.appendChild(item);
                });
                searchSuggestions.classList.add('active');
            } else {
                searchSuggestions.classList.remove('active');
                searchSuggestions.innerHTML = '';
            }
        });

        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.remove('active');
            }
        });
    }
});