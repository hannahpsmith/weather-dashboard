const apiKey = '5aba088f44d1f5243d0c5451180f8f54';
const citySearch = document.getElementById('citySearch');
const cityName = document.getElementById('cityName');

//local storage
let weatherSearchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

function savedCities() {
    let weatherSearchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    return weatherSearchHistory;
}

function saveStorage {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(weatherSearchHistory));
}

//event listener on form submission
citySearch.addEventListener("click", (event) => {
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
}