
(function() {
    if(window.localStorage)
      console.log("Local Storage Supported")
    else
      console.log("Local Storage Not Supported")

    // On Window load check if there are cache results to display.
    if(localStorage.getItem("WeatherResults"))
        displayResults();
   // else
        // If there is no cached weather retrieve a default location.
      //  getResults ("Pretoria")
})();


if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker
        .register('sw_cached_pages.js')
        .then(reg => console.log('Service Worker: Registered'))
        .catch(err => console.log(`Service Worker: Error:  ${err}`));
    })
}

const api = {
    key: "#######",   //Generated API key from Openweather website
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);   //listens for keyboard input on "Enter" key

function setQuery(evt) {
    if (evt.keyCode == 13){  // enter,return key on keyboard value
        getResults(searchbox.value);
        console.log(searchbox.value);
    }
}

function getResults (query) {
    // Save Search query to local storage , can be removed.
    localStorage.setItem("SearchQuery", query);

    fetch(`${api.baseurl}/weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(results => {
        // Save the weather object to localstorage as a string.
        localStorage.setItem("WeatherResults", JSON.stringify(results));
        displayResults();
    });
}

function displayResults () {
    // Parse the localstorage string file into usable JSON.
    const weather = JSON.parse(localStorage.getItem("WeatherResults"));
    
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let today = new Date(); 

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
   // let time = ","+today.getHours() + ":"+today.getMinutes();
    let time = `, ${today.getHours()}:${(today.getMinutes() < 10 ? '0': '') + today.getMinutes()}`;

    return `${day} ${date} ${month} ${year} ${time}`;
}
