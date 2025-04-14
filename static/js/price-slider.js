document.addEventListener('DOMContentLoaded', function() {
    const minSlider = document.getElementById('min-price-slider');
    const maxSlider = document.getElementById('max-price-slider');
    const minDisplay = document.getElementById('min-price-display');
    const maxDisplay = document.getElementById('max-price-display');
    const sliderRange = document.querySelector('.slider-range');
    
    if (!minSlider || !maxSlider) return;
    
    // Format price with commas and rupee symbol
    function formatPrice(price) {
        return '₹' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Update slider range and displays
    function updateSlider() {
        // Calculate percentage positions for the range
        const minVal = parseInt(minSlider.value);
        const maxVal = parseInt(maxSlider.value);
        const minPercent = ((minVal - minSlider.min) / (minSlider.max - minSlider.min)) * 100;
        const maxPercent = ((maxVal - minSlider.min) / (minSlider.max - minSlider.min)) * 100;
        
        // Update the range display
        sliderRange.style.left = minPercent + '%';
        sliderRange.style.width = (maxPercent - minPercent) + '%';
        
        // Update price displays
        minDisplay.textContent = formatPrice(minVal);
        
        if (maxVal >= 100000) {
            maxDisplay.textContent = '₹100,000+';
        } else {
            maxDisplay.textContent = formatPrice(maxVal);
        }
        
        if (minVal >= maxVal) {
            minSlider.value = maxVal - 100;
            updateSlider();
        }
    }
    
    updateSlider();
    
    minSlider.addEventListener('input', updateSlider);
    maxSlider.addEventListener('input', updateSlider);
});