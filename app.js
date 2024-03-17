// State
let currCity = "Jorhat";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

// Search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // Prevent default action
    e.preventDefault();
    // Change current city
    currCity = search.value;
    // Get weather forecast 
    getWeather();
    // Clear form
    search.value = "";
});

// Units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        // Change to metric
        units = "metric";
        // Get weather forecast 
        getWeather();
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        // Change to imperial
        units = "imperial";
        // Get weather forecast 
        getWeather();
    }
});

// Function to convert timestamp to formatted date and time
function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600; // Convert seconds to hours 

    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    formatter.timeZone = `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`;

    return formatter.format(date);
}

// Function to convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country);
}

// Function to fetch weather data
function getWeather() {
    const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
            weather__forecast.innerHTML = `<p>${data.weather[0].main}`;
            weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
            weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" />`;
            weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
            weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
            weather__humidity.innerHTML = `${data.main.humidity}%`;
            weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
            weather__pressure.innerHTML = `${data.main.pressure} hPa`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Fetch weather data on page load
document.addEventListener('DOMContentLoaded', getWeather);

