const apiKey = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");
const loader = document.getElementById("loader");

const weatherBox = document.getElementById("weatherBox");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");

const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const condition = document.getElementById("condition");

searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value.trim());
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getWeather(cityInput.value.trim());
    }
});

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

async function getWeather(city) {

    if (!city) {
        message.textContent = "Please enter a city name";
        return;
    }

    message.textContent = "";
    weatherBox.classList.add("hidden");

    showLoader();

    try {

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await res.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        displayWeather(data);

    } catch (err) {
        message.textContent = err.message;
    }

    hideLoader();
}

function displayWeather(data) {

    weatherBox.classList.remove("hidden");

    cityName.textContent = `${data.name}, ${data.sys.country}`;

    temp.textContent = `🌡 Temperature: ${data.main.temp} °C`;

    humidity.textContent = `💧 Humidity: ${data.main.humidity}%`;

    wind.textContent = `🌬 Wind Speed: ${data.wind.speed} m/s`;

    condition.textContent = `☁ Condition: ${data.weather[0].main}`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}