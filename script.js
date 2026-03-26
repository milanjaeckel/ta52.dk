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

// countdown timer to March 27, 2026 (Copenhagen timezone)
<<<<<<< HEAD
const targetDate = new Date('2026-03-27T14:00:00').toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
=======
const targetDate = new Date('2026-03-28T00:00:00').toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
>>>>>>> 595d0f72c68c7c9a176cf86aef53e56b3e09b5c2
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

// weather widget: Værløse, Copenhagen, Denmark (detailed)
const weatherLat = 55.7833;
const weatherLon = 12.3833;

const weatherCodeMap = {
    0: {desc: 'Clear', emoji: '☀️'},
    1: {desc: 'Mainly clear', emoji: '🌤️'},
    2: {desc: 'Partly cloudy', emoji: '⛅'},
    3: {desc: 'Overcast', emoji: '☁️'},
    45: {desc: 'Fog', emoji: '🌫️'},
    48: {desc: 'Depositing rime fog', emoji: '🌫️'},
    51: {desc: 'Light drizzle', emoji: '🌦️'},
    53: {desc: 'Moderate drizzle', emoji: '🌧️'},
    55: {desc: 'Dense drizzle', emoji: '🌧️'},
    61: {desc: 'Slight rain', emoji: '🌦️'},
    63: {desc: 'Moderate rain', emoji: '🌧️'},
    65: {desc: 'Heavy rain', emoji: '⛈️'},
    71: {desc: 'Slight snow', emoji: '🌨️'},
    73: {desc: 'Moderate snow', emoji: '🌨️'},
    75: {desc: 'Heavy snow', emoji: '❄️'},
    80: {desc: 'Rain showers', emoji: '🌧️'},
    81: {desc: 'Heavy showers', emoji: '⛈️'},
    95: {desc: 'Thunderstorm', emoji: '⛈️'}
};

function mapWeatherCode(code) {
    return weatherCodeMap[code] || {desc: 'Unknown', emoji: '🌈'};
}

function degToCompass(num) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return arr[(val % 16)];
}

async function fetchWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${weatherLat}&longitude=${weatherLon}&current_weather=true&hourly=relativehumidity_2m,windspeed_10m,winddirection_10m&daily=sunrise,sunset&timezone=Europe%2FCopenhagen`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        const cw = data.current_weather;
        if (!cw) throw new Error('No current weather data');

        const tempEl = document.getElementById('weatherTemp');
        const descEl = document.getElementById('weatherDesc');
        const iconEl = document.getElementById('weatherIcon');
        const windEl = document.getElementById('weatherWind');
        const windDirEl = document.getElementById('weatherWindDir');
        const humidityEl = document.getElementById('weatherHumidity');
        const sunriseEl = document.getElementById('weatherSunrise');
        const sunsetEl = document.getElementById('weatherSunset');
        const updatedEl = document.getElementById('weatherUpdated');

        const code = cw.weathercode;
        const mapped = mapWeatherCode(code);

        // find index for current time in hourly arrays (use nearest if exact match not found)
        let idx = -1;
        if (data.hourly && data.hourly.time) {
            idx = data.hourly.time.indexOf(cw.time);
            if (idx === -1) {
                const cwMs = new Date(cw.time).getTime();
                let minDiff = Infinity;
                let nearest = -1;
                data.hourly.time.forEach((t, i) => {
                    const d = Math.abs(new Date(t).getTime() - cwMs);
                    if (d < minDiff) { minDiff = d; nearest = i; }
                });
                idx = nearest;
            }
        }

        if (tempEl) tempEl.textContent = `${Math.round(cw.temperature)}°C`;
        if (descEl) descEl.textContent = mapped.desc;
        if (iconEl) iconEl.textContent = mapped.emoji;
        if (windEl) windEl.textContent = `${cw.windspeed} m/s`;
        if (windDirEl) windDirEl.textContent = cw.winddirection ? `${degToCompass(cw.winddirection)} (${Math.round(cw.winddirection)}°)` : '--';

        if (idx !== -1 && data.hourly.relativehumidity_2m) {
            const hum = data.hourly.relativehumidity_2m[idx];
            if (humidityEl) humidityEl.textContent = `${hum}%`;
        }

        if (data.daily && data.daily.sunrise && data.daily.sunrise[0]) {
            if (sunriseEl) sunriseEl.textContent = new Date(data.daily.sunrise[0]).toLocaleTimeString('da-DK', {timeZone: 'Europe/Copenhagen', hour: '2-digit', minute: '2-digit'});
        }
        if (data.daily && data.daily.sunset && data.daily.sunset[0]) {
            if (sunsetEl) sunsetEl.textContent = new Date(data.daily.sunset[0]).toLocaleTimeString('da-DK', {timeZone: 'Europe/Copenhagen', hour: '2-digit', minute: '2-digit'});
        }

        if (updatedEl) updatedEl.textContent = new Date(cw.time).toLocaleTimeString('da-DK', {timeZone: 'Europe/Copenhagen', hour: '2-digit', minute: '2-digit'});
    } catch (err) {
        const descEl = document.getElementById('weatherDesc');
        if (descEl) descEl.textContent = 'Weather unavailable';
        console.log('Weather error:', err);
    }
}

// refresh weather every 10 minutes
fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);

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

