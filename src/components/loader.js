// loader.js
export function showLoader() {
    const loader = document.querySelector('.overlayLoader');
    if (loader) {
        loader.classList.add('visible');
    }
}

export function removeLoader() {
    const loader = document.querySelector('.overlayLoader');
    if (loader) {
        loader.classList.remove('visible');
    }
}