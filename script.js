// invert favicon colors
fetch('house.svg')
    .then(response => response.text())
    .then(svgContent => {
        // add invert filter to the SVG
        const invertedSvg = svgContent.replace('<svg', '<svg style="filter: invert(1)"');
        const dataUri = 'data:image/svg+xml;base64,' + btoa(invertedSvg);
        const link = document.querySelector('link[rel="icon"]');
        link.href = dataUri;
    })
    .catch(err => console.log('Could not invert favicon:', err));

// parallax background effect on mousemove
const bgEl = document.querySelector('.bg');
const parallaxLayers = [20, 50, 90, 130]; // different speeds for each layer

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    const bgPositions = parallaxLayers.map(speed => {
        return `${x * speed / 100}px ${y * speed / 100}px`;
    }).join(', ');
    
    bgEl.style.backgroundPosition = bgPositions;
    bgEl.style.animation = 'none'; // stop idle animation when moving
});

// resume idle animation after mouse stops
let parallaxTimeout;
document.addEventListener('mousemove', () => {
    clearTimeout(parallaxTimeout);
    parallaxTimeout = setTimeout(() => {
        bgEl.style.animation = 'idleParallax 20s ease-in-out infinite';
    }, 1000);
});

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

// countdown timer to June 26, 2026 (Copenhagen timezone)
const targetDate = new Date('2026-06-26T00:00:00').toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
const targetTime = new Date(targetDate).getTime();

function updateCountdown() {
    // get current time in Copenhagen timezone
    const nowInCph = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
    const now = nowInCph.getTime();
    
    const distance = targetTime - now;
    
    const countdownContainer = document.getElementById('countdownContainer');
    const countdownMessage = document.getElementById('countdownMessage');
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('countdownDays').textContent = days;
        document.getElementById('countdownHours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdownMinutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdownSeconds').textContent = seconds.toString().padStart(2, '0');
        
        countdownContainer.style.display = 'flex';
        countdownMessage.style.display = 'none';
    } else {
        countdownContainer.style.display = 'none';
        countdownMessage.style.display = 'block';
        countdownMessage.textContent = '🎉 The time has arrived! 🎉';
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

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

