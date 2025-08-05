const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const API_KEY = "Your_API_Key_Here";

// DOM elements
const searchBox = document.querySelector("#searchInput");
const btn = document.querySelector("#btn");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDiv = document.querySelector("#weather");
const loadingDiv = document.querySelector("#loading");
const errorDiv = document.querySelector("#error");
const card = document.querySelector(".card");

// Weather condition mappings
const weatherConditions = {
    "Clear": "clear",
    "Clouds": "clouds", 
    "Rain": "rain",
    "Drizzle": "rain",
    "Thunderstorm": "rain",
    "Snow": "snow",
    "Mist": "mist",
    "Smoke": "mist",
    "Haze": "mist",
    "Dust": "mist",
    "Fog": "mist",
    "Sand": "mist",
    "Ash": "mist",
    "Squall": "mist",
    "Tornado": "mist"
};

// Show loading state
function showLoading() {
    loadingDiv.style.display = "block";
    weatherDiv.style.display = "none";
    errorDiv.style.display = "none";
}

// Hide loading state
function hideLoading() {
    loadingDiv.style.display = "none";
}

// Show error message
function showError(message) {
    errorDiv.querySelector("span").textContent = message;
    errorDiv.style.display = "block";
    weatherDiv.style.display = "none";
    hideLoading();
}

// Hide error message
function hideError() {
    errorDiv.style.display = "none";
}

// Update weather background based on condition
function updateWeatherBackground(condition) {
    // Remove all weather classes
    card.classList.remove('clear', 'clouds', 'rain', 'snow', 'mist');
    
    // Add appropriate class
    if (weatherConditions[condition]) {
        card.classList.add(weatherConditions[condition]);
    }
}

// Update weather icon based on condition
function updateWeatherIcon(condition) {
    const iconMap = {
        "Clear": "clear.png",
        "Clouds": "clouds.png",
        "Rain": "rain.png",
        "Drizzle": "drizzle.png",
        "Thunderstorm": "rain.png",
        "Snow": "snow.png",
        "Mist": "mist.png",
        "Smoke": "mist.png",
        "Haze": "mist.png",
        "Dust": "mist.png",
        "Fog": "mist.png",
        "Sand": "mist.png",
        "Ash": "mist.png",
        "Squall": "wind.png",
        "Tornado": "wind.png"
    };
    
    weatherIcon.src = iconMap[condition] || "clear.png";
}

// Format time from timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

// Main weather check function
async function checkWeather(city) {
    if (!city.trim()) {
        showError("Please enter a city name");
        return;
    }

    showLoading();
    hideError();

    try {
        const response = await fetch(BASE_URL + city + `&appid=${API_KEY}`);
        
        if (response.status === 404) {
            showError("City not found. Please check the spelling and try again.");
            return;
        }
        
        if (!response.ok) {
            showError("Something went wrong. Please try again later.");
            return;
        }

        const data = await response.json();
        console.log(data);

        // Update weather display
        updateWeatherDisplay(data);
        
        // Update background and icon
        updateWeatherBackground(data.weather[0].main);
        updateWeatherIcon(data.weather[0].main);
        
        // Show weather data
        weatherDiv.style.display = "block";
        hideLoading();
        
        // Add success animation
        weatherDiv.style.animation = "none";
        weatherDiv.offsetHeight; // Trigger reflow
        weatherDiv.style.animation = "fadeInUp 0.8s ease forwards";

    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError("Network error. Please check your connection and try again.");
    }
}

// Update weather display with all data
function updateWeatherDisplay(data) {
    // Basic weather info
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";
    
    // Weather description
    document.querySelector(".weather-description").innerHTML = data.weather[0].description;
    
    // Additional weather info
    document.querySelector(".feels-like").innerHTML = Math.round(data.main.feels_like) + "°C";
    document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
    document.querySelector(".visibility").innerHTML = (data.visibility / 1000) + " km";
}

// Event listeners
btn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Enter key support
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Focus on search input when page loads
window.addEventListener("load", () => {
    searchBox.focus();
});

// Add some interactive effects
searchBox.addEventListener("focus", () => {
    searchBox.parentElement.style.transform = "scale(1.02)";
});

searchBox.addEventListener("blur", () => {
    searchBox.parentElement.style.transform = "scale(1)";
});

// Mobile-specific optimizations
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Prevent zoom on input focus for mobile
if (isMobile()) {
    searchBox.addEventListener("focus", () => {
        // Prevent zoom on iOS
        setTimeout(() => {
            searchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });
}

// Add touch feedback for mobile
if (isMobile()) {
    const touchElements = document.querySelectorAll('.search button, .col, .weather-info-item');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', () => {
            element.style.transform = '';
        });
    });
}

// Add hover effects for weather info items
document.addEventListener("DOMContentLoaded", () => {
    const weatherInfoItems = document.querySelectorAll(".weather-info-item");
    
    weatherInfoItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            item.style.transform = "translateY(-5px) scale(1.02)";
        });
        
        item.addEventListener("mouseleave", () => {
            item.style.transform = "translateY(0) scale(1)";
        });
    });
});

// Add smooth scrolling and parallax effect
window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector("body::before");
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Initialize with a default city (optional)
// checkWeather("London");


