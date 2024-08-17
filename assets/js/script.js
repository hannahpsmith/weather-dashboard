const apiKey = '5aba088f44d1f5243d0c5451180f8f54';
const citySearch = document.getElementById('citySearch');
const cityName = document.getElementById('cityName');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('searchHistory');
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
    getLocation();
    showHeader(show5DayHeader);
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
        console.log('Error fetching weather data', error);
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

        const city = weather.name;
        if (!weatherSearchHistory.includes(city)) {
            weatherSearchHistory.push(city);
            saveStorage();
        }

        // savedCities(weatherSearchHistory);
        updateSearchHistory();
    })
    .catch(function(error) {
        console.log('Error fetching weather data', error);
    })
}

function getForecast(data) {
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`;


    fetch(forecastAPI)
    .then(function(response) {
        return response.json();
    })
    .then(function(forecast) {
        displayForecast(forecast);
    })
    .catch(function(error) {
        console.log('Error fetching forecast data', error);
    })
}

// display current weather data
function displayWeather(weather) {
    const weatherHtml = `
        <div class="weather-card">
            <h2>${weather.name} (${new Date(weather.dt * 1000).toLocaleDateString()}) <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}"></h2>
            <p><strong>Temp:</strong> ${weather.main.temp}°F</p>
            <p><strong>Wind:</strong> ${weather.wind.speed} MPH</p>
            <p><strong>Humidity:</strong> ${weather.main.humidity} %</p>
        </div>
    `;
    currentWeather.innerHTML = weatherHtml;
}

//display forecast data
function displayForecast(weather) {
    const forecastHtml = weather.list
    .filter((_, index) => index % 8 === 0)
    .map(forecast => `
        <div class="forecast-card">
          <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
          <p><strong>Temp:</strong> ${forecast.main.temp} °F</p>
          <p><strong>Wind:</strong> ${forecast.wind.speed} MPH</p>
          <p><strong>Humidity:</strong> ${forecast.main.humidity} %</p>
        </div>
      `).join('');
      forecast.innerHTML = forecastHtml;
}

const show5DayHeader = document.getElementById('showHeader');

// hides forecast header until city is searched
function showHeader() {
    if (show5DayHeader.style.display === 'none') {
        show5DayHeader.style.display = 'block';
    } else {
        show5DayHeader.style.display = 'none';
    }
}

function updateSearchHistory() {
    searchHistory.innerHTML = weatherSearchHistory.map(city => `<button class="history-btn">${city}</button>`).join('');
    clearHistory.classList.toggle('hidden', weatherSearchHistory.length === 0);
  }
  
  searchHistory.addEventListener('click', (event) => {
    if (event.target.classList.contains('history-btn')) {
        getLocation(event.target.textContent);
    }
});
  clearHistory.addEventListener('click', () => {
    localStorage.removeItem('weatherSearchHistory');
    weatherSearchHistory = [];
    updateSearchHistory();
  });

  updateSearchHistory();
