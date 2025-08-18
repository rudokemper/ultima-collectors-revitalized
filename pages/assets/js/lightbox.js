// Lightbox functionality
function openLightbox(imageSrc) {
    document.getElementById('lightbox').style.display = 'block';
    document.getElementById('lightbox-image').src = imageSrc;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close lightbox on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});

// Add click handlers to all images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.image-item img');
    images.forEach(function(img) {
        img.addEventListener('click', function() {
            openLightbox(this.src);
        });
    });
});