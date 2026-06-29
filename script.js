const apiKey = "YOUR_OPENWEATHER_API_KEY";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeToggle = document.getElementById("themeToggle");

const loader = document.getElementById("loader");
const message = document.getElementById("message");

const weatherResult = document.getElementById("weatherResult");
const forecast = document.getElementById("forecast");

searchBtn.onclick = () => getWeather(cityInput.value);
locationBtn.onclick = getLocationWeather;

themeToggle.onclick = () => {
document.body.classList.toggle("dark");
};

function showLoader() {
loader.classList.remove("hidden");
}

function hideLoader() {
loader.classList.add("hidden");
}

async function getWeather(city) {

    if (!city) return;

    showLoader();
    message.textContent = "";

    try {

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await res.json();

        // ✅ REAL FIX HERE
        if (data.cod !== 200) {
            throw new Error(data.message || "City not found");
        }

        updateUI(data);
        getForecast(city);

    } catch (err) {
        message.textContent = "⚠ " + err.message;
        weatherResult.classList.add("hidden");
    }

    hideLoader();
}

async function getLocationWeather() {

navigator.geolocation.getCurrentPosition(async (pos) => {

showLoader();

const { latitude, longitude } = pos.coords;

const res = await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
);

const data = await res.json();

updateUI(data);
getForecast(data.name);

hideLoader();

});
}

function updateUI(data) {

weatherResult.classList.remove("hidden");

document.getElementById("cityName").textContent = data.name;
document.getElementById("temperature").textContent = data.main.temp + "°C";
document.getElementById("humidity").textContent = "Humidity: " + data.main.humidity;
document.getElementById("wind").textContent = "Wind: " + data.wind.speed;
document.getElementById("condition").textContent = data.weather[0].description;

document.getElementById("weatherIcon").src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

async function getForecast(city) {

const res = await fetch(
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
);

const data = await res.json();

forecast.innerHTML = "";

const days = data.list.filter(d => d.dt_txt.includes("12:00:00"));

days.slice(0,5).forEach(day => {

forecast.innerHTML += `
<div class="card">
<p>${new Date(day.dt_txt).toDateString().slice(0,10)}</p>
<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
<p>${day.main.temp}°C</p>
</div>
`;

});
}

function saveCity(city) {
localStorage.setItem("lastCity", city);
}

window.onload = () => {
const last = localStorage.getItem("lastCity");
if (last) getWeather(last);
};
