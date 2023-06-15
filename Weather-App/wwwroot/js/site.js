// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var APIkey = `cb8d3a328e6b7aa47d98d6e678c6df07`
var selectedCity=``
var todayDate = moment().format(`L`)

var savedCities = JSON.parse(localStorage.getItem(`city`)) || []

init(savedCities)
//event handlers :
//search button
$(`#citySubmit`).on(`click`, function () {
    var selectedCity = $("#city").val().trim()
    if (selectedCity != ``) {
        getWeatherToday(selectedCity)
        getForecast(selectedCity)

        if (!savedCities.includes(selectedCity)) {
            savedCities.push(selectedCity)//if city entered is not in savedcities array, it will be added to array
            var cityArchiveEl = `     
        <button type="button" id="savedCitySubmit" city-data="${selectedCity}">${selectedCity}</button>`
            $(`#cityArchive`).append(cityArchiveEl)
        }
        localStorage.setItem("city", JSON.stringify(savedCities))
    }
})
//saved cities as buttons
$(document).on("click", "#savedCitySubmit", function () {
    var archiveCity = $(this).text();
    getWeatherToday(archiveCity)
    getForecast(archiveCity)
})
//provided a clear history and refresh page button
$(`#clear`).on("click", function () {
    localStorage.clear();
    searchHistory = [];
    window.location.reload("Refresh")

})


function getWeatherToday(selectedCity) {

    //use user input to make API call for rendering curent date weather info
    var weatherRequest = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=imperial&appid=${APIkey}`
    $.ajax({
        url: weatherRequest,
        method: `GET`
    }).then(function (weatherData) {
        console.log(weatherData)//using object retrieved from API render weather info onto page
        $(`#today`).empty()
        var todayEl = ` 
        <div class="card" style="max-width: 30rem;>
         <h3 class="card-header" id="selectedCityName">${weatherData.name} - ${todayDate} </h3>  
         <ul class="card-body list">
         <li><b>Condition: </b>${weatherData.weather[0].description}</li>
          <li><b><img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}"></li>   
          
          <li><b>Temperature:</b> ${weatherData.main.temp}°F</li>
          <li><b>Humidity: </b>${weatherData.main.humidity}%</li>
          <li><b>Wind Speed:</b> ${weatherData.wind.speed} MPH</li>

         </ul>
        </div>`
        $(`#today`).append(todayEl)
    })
}

//retrieve 5 day data w/api call based on user input
function getForecast(selectedCity) {
    var forecastRequest = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${APIkey}`
    $.ajax({
        url: forecastRequest,
        method: `GET`
    }).then(function (forecastData) {
        console.log(forecastData)
        console.log(moment.unix(forecastData.list[0].dt).format("MM/DD/YYYY"))

        $(`#forecastDisplay`).empty()

        let i = 4
        while (i < 40) { //5 day data is provided in 3 hr increments, 4th = noon, +8 is equal to a day.
            var forecastDay = moment.unix(forecastData.list[i].dt).format("MM/DD/YYYY")
            var forecastEl = `
            <div class="card text-bg-primary m-2" style="max-width: 12rem;">
             <ul class="card-body list">
              <li>${forecastDay}</li>
              <li><b>Condition:</b> ${forecastData.list[i].weather[0].description}</li>
              <li><img src="https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png" alt="${forecastData.list[i].weather[0].description}"></li>            
              <li><b>Temperature:</b> ${forecastData.list[i].main.temp}°F</li>
              <li><b>Humidity:</b> ${forecastData.list[i].main.humidity}%</li>
              <li><b>Wind Speed:</b> ${forecastData.list[i].wind.speed} MPH</li> 
             </ul>
            </div>
            `
            $(`#forecastDisplay`).append(forecastEl)
            i = i + 8;
        }
    })
}
function init() {//populate city archive from local storage displaying entries searched in the past
    savedCities.forEach(function (i) {
        var cityArchiveEl = `     
        <button type="button" class="btn btn-primary" id="savedCitySubmit" city-data="${i}">${i}</button>`
        $(`#cityArchive`).append(cityArchiveEl)
    })
}

