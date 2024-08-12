const apiKey = '5aba088f44d1f5243d0c5451180f8f54';
const citySearch = document.getElementById('citySearch');
const cityName = document.getElementById('cityName');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const clearHistory = document.getElementById('clearHistory');

//local storage
let weatherSearchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

function savedCities() {
    let weatherSearchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    return weatherSearchHistory;
}

function saveStorage() {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(weatherSearchHistory));
}

//event listener on form submission
citySearch.addEventListener("click", function(event) {
    savedCities();
    event.preventDefault();
    getLocation;
})

//fetch city latitude longtitude
function getLocation(city) {
    const userInput = document.getElementById('cityName');
    let search;
    if (!city) {
        search = userInput.value;
    } else {
        search = city;
    }

    const geoApi = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${apiKey}`;
    console.log(geoApi)

    fetch(geoApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        getWeather(data);
        getForecast(data);
        userInput.value = '';
    })
    .catch(function(error) {
        console.log(error);
    })
}


function getWeather(data) {
    savedCities();
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`;

    fetch(weatherAPI)
    .then(function(response) {
        return response.json();
    })
    .then(function(weather) {
        displayWeather(weather);
    })
    .catch(function(error) {
        console.log('error');
    })
}

function getForecast(data) {
    savedCities();
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`;

    fetch(forecastAPI)
    .then(function(response) {
        return response.json();
    })
    .then(function(forecast) {
        displayForecast(forecast);
    })
    .catch(function(error) {
        console.log('error');
    })
}

// display current weather data
function displayWeather(city, data) {
    const current = data.list[0];
    const weatherHtml = `
          <div class="weather-card">
        <h2>${city} (${new Date(current.dt * 1000).toLocaleDateString()})</h2>
        <p><strong>Temp:</strong> ${current.main.temp}°F</p>
        <p><strong>Wind:</strong> ${current.wind.speed} MPH</p>
        <p><strong>Humidity:</strong> ${current.main.humidity} %</p>
        <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
      </div>
    `;
    currentWeather.innerHTML = weatherHtml;
}