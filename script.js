// parallax effect removed per user request (background is static)


// clock update
const clockEl = document.getElementById('clock');
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    const secs = now.getSeconds().toString().padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}:${secs}`;
}
setInterval(updateClock, 1000);
updateClock();

// google search
const searchInput = document.getElementById('googleSearch');
const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', () => {
    const query = encodeURIComponent(searchInput.value.trim());
    if (query) {
        window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener');
    }
});
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

