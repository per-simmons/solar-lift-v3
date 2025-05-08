document.addEventListener('DOMContentLoaded', function() {
  // Initialize the Splide carousel with proper options
  const splide = new Splide('#case-studies-splide', {
    type: 'slide',
    perPage: 1,
    perMove: 1,
    gap: 0, // Eliminated gap between slides
    padding: { left: 0, right: 0 }, // Remove any padding
    arrows: false, // We'll use custom arrows
    pagination: false,
    drag: true,
    trimSpace: false, // Don't trim space to prevent jumps
    autoWidth: false, // Force full width
    fixedWidth: false,
    rewind: true,
    speed: 300,
    easing: 'ease',
    breakpoints: {
      991: {
        gap: 0 // Eliminated gap for desktop
      },
      768: {
        gap: 0 // Eliminated gap for mobile
      }
    }
  });
  
  // Mount the Splide instance
  splide.mount();
  
  // Add event listeners for custom arrows
  const prevButton = document.querySelector('.splide__arrow--prev');
  const nextButton = document.querySelector('.splide__arrow--next');
  
  if (prevButton && nextButton) {
    prevButton.addEventListener('click', function() {
      splide.go('<');
    });
    
    nextButton.addEventListener('click', function() {
      splide.go('>');
    });
  }
});