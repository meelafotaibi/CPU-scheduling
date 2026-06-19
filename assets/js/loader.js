// Loading Screen Handler
window.addEventListener('load', function () {
    const loader = document.querySelector('.loader-wrapper');

    // Minimum display time of 800ms for smooth UX
    setTimeout(function () {
        loader.classList.add('fade-out');

        // Remove from DOM after fade completes
        setTimeout(function () {
            loader.style.display = 'none';
        }, 500);
    }, 800);
});
