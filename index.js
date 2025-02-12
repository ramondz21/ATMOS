//Init
const apiKey = "0b8fa2ed941ce1a86f8b7d86ccca9d84";
const form = document.querySelector(".search-form");
const input = document.querySelector("input[aria-label='Search for a city']");
const cityName = document.querySelector(".weather-main h1");
const dateElement = document.querySelector(".weather-main .date");
const tempElement = document.querySelector(".temperature .temp");
const conditionElement = document.querySelector(".temperature .condition");
const humidityElement = document.querySelector(
  ".weather-details .detail:nth-child(1) .value"
);
const windElement = document.querySelector(
  ".weather-details .detail:nth-child(2) .value"
);
const pressureElement = document.querySelector(
  ".weather-details .detail:nth-child(3) .value"
);
const forecastContainer = document.querySelector(".forecast-container");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city === "") return;

  try {
    const weatherData = await getWeather(city);
    updateWeatherUI(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
});

async function getWeather(city) {
  //Fetch data from API
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("City not found");
  return await response.json();
}

function updateWeatherUI(data) {
  //Update UI realtime
  const currentWeather = data.list[0];
  const today = new Date(currentWeather.dt * 1000);

  cityName.textContent = data.city.name;
  dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  tempElement.textContent = `${Math.round(currentWeather.main.temp)}°C`;
  conditionElement.textContent = currentWeather.weather[0].description;
  humidityElement.textContent = `${currentWeather.main.humidity}%`;
  windElement.textContent = `${currentWeather.wind.speed} km/h`;
  pressureElement.textContent = `${currentWeather.main.pressure} hPa`;

  // Ambil data setiap 24 Jam
  forecastContainer.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    forecastContainer.innerHTML += `
      <div class="forecast-day">
        <span class="day">${dayName}</span>
        <span class="temp">${Math.round(forecast.main.temp)}°C</span>
        <span class="condition">${forecast.weather[0].description}</span>
      </div>
    `;
  }
}
