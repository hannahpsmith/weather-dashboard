const apiKey = '5aba088f44d1f5243d0c5451180f8f54';
const citySearch = document.getElementById('citySearch');
const cityName = document.getElementById('cityName');

//local storage
let weatherSearchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

function savedCities() {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    return savedCities;
}

//event listener on form submission
citySearch.addEventListener("click", (event) => {
    savedCities();
    event.preventDefault();
})


const geoApi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
console.log(geoApi);

// const weatherAPI `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
