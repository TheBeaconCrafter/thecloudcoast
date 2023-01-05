const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const visOutput = document.querySelector('.vis');
const rainPrecOutput = document.querySelector('.rain-prec');
const airQualOutput = document.querySelector('.airqual');

const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');


/////////////////////////
/////////////////////////
const debugMode = true;//
/////////////////////////
/////////////////////////

//Default city (opens when page loads)
let cityInput = "London"


/////////////////////////////////////////////////////////
//DARK AND LIGHT MODE

var mode = document.getElementById('mode');

mode.onclick = function() {
    document.body.classList.toggle('dark-theme');
    console.log('Toggled between light or dark mode (user click)!');
    if(document.body.classList.contains('dark-theme')) {
        document.cookie = "theme=dark";
        mode.src = "icons/assets/sun.png";
        console.log('Darkmode cookie was saved!');
    } else {
        document.cookie = "theme=light";
        mode.src = "icons/assets/moon.png";
        console.log('Light mode cookie was saved!');
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while(c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if(c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return ""
}

if(getCookie("theme").length == 0) {
    document.cookie = "theme=light"
}

//////////////////////////////////////////////////////////

close.addEventListener('click', () => {
    modal_container.classList.remove('show');
});

open.addEventListener('click', () => {
    modal_container.classList.add('show');
});


function checkDarkMode() {
    if(document.cookie == "theme=dark") {
        console.log('Dark mode detected from cookie!');
        document.body.classList.toggle('dark-theme');
        document.cookie = "theme=dark";
        mode.src = "icons/assets/sun.png";
        console.log('Activated dark mode!');
        return true;
    } else if (document.cookie == "theme=light") {
        console.log('Light mode detected from cookie!');
        document.cookie = "theme=light";
        mode.src = "icons/assets/moon.png";
        console.log('Activated light mode!');
        return false;
    } else {
        console.log('No mode detected from cookie! Defaulting to light.');
        return false;
    }
}

//Click event fot all cities in the side panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        //Change to the clicked city
        cityInput = e.target.innerHTML;
        /* This function fetches all weather data from the API, soon to be written ;) */
        fetchWeatherData();
        //fetchTomorrowData();
        //Fade out
        app.style.opacity = "0";
    });
})



//Submit event to the form
form.addEventListener('submit', (e) => {
    //Add catch if the search bar is empty
    if(search.value.length == 0) {
        alert('Please type in a city name');
    } else {
        //Change to the requested city
        cityInput = search.value;
        fetchWeatherData();
        //fetchTomorrowData();
        search.value = ""; //Clear the search box
        app.style.opacity = "0"; //fade out
    }
    e.preventDefault(); //prevents the form's default behaviour and uses our behaviour
});

/* This function returns the weekday (Monday, Tuesday, etc.)
of a given date (12 03 2021 - dd mm yyyy) */
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

/*This function gets all the needed weather data from the API!*/
function fetchWeatherData() {
    //Fetch the data and add the city name to the request

    if(debugMode){
        console.log("We are now fetching the weather data");
    }

    
    fetch(`https://api.weatherapi.com/v1/current.json?key=YOURAPIKEYHERE&q=` + cityInput + `&aqi=yes`)
    //Take the JSON data and convert it to a JS object
    
    .then(response => response.json())
    .then(data => {
        console.log(data); //so we can see what data is available
        if(debugMode){
            console.log("Data has been retrieved and converted");
        }
        //Temperature and weather condition
        temp.innerHTML = Math.round(data.current.temp_c) + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        if(debugMode){
            console.log("Printed the temperature and condition");
        }

        //Get the date and time of the city
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}` //adding the local date
        timeOutput.innerHTML = time; //Adding the local time
        nameOutput.innerHTML = data.location.name; //Adding the city name

        if(debugMode){
            console.log("Date and city name are working");
        }
        //rainPrecOutput.innerHTML = data.current.precip_mm + " mm in next 24h"; //Rain precipation in mm

        //get corresponding icon url
        const iconId = data.current.condition.icon.substr(
            "//cdn.weatherapi.com/weather/64x64/".length);
        //use the local icon
        icon.src = "./icons/" + iconId;

        if(debugMode){
            console.log("Got the icon url and printed it");
        }
        
        //Add weather details to page
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";
        visOutput.innerHTML = data.current.vis_km + "km";

        if(debugMode){
            console.log("These weather details were fetched: cloud, humidity, wind, visibility");
        }

        //airQualOutput.innerHTML = data.current.air_quality.pm10; //ozone levels

        
        
        
        if(data.current.air_quality.o3 <= 16) {
            airQualOutput.innerHTML = "Really Good (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 <= 33) {
            airQualOutput.innerHTML = "Good (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 <= 50) {
            airQualOutput.innerHTML = "Good (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 <= 58) {
            airQualOutput.innerHTML = "Moderate (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 <= 66) {
            airQualOutput.innerHTML = "Moderate (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 <= 75) {
            airQualOutput.innerHTML = "Moderate (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 <= 83) {
            airQualOutput.innerHTML = "Bad (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 <= 91) {
            airQualOutput.innerHTML = "Bad (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 <= 100) {
            airQualOutput.innerHTML = "Bad (" + Math.round(data.current.air_quality.pm10) + ")";
        } else if (data.current.air_quality.o3 >= 101) {
            airQualOutput.innerHTML = "Really Bad (" + Math.round(data.current.air_quality.pm10) + ")";
        }

        //Data by https://uk-air.defra.gov.uk/air-pollution/daqi?view=more-info&pollutant=ozone#pollutant

        if(debugMode){
            console.log("Air quality fetched");
        }

        //set default time of the day
        let timeOfDay = "wallpaper";
        
        const code = data.current.condition.code;

        //Change to night if it's night time
        if(!data.current.is_day) {
            console.log("It is night time in this city!");
            timeOfDay = "wallpaper";
        } else {
            console.log("It is day time in this city!");
        }

        if(code <= 1228) {
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/${code}.jpg)`;
            btn.style.background = "#e5ba92";
            if(timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        } else {
            if(code == 1000) {
                //weather is clear
                console.log("Weather code is 1000, which means it's clear!");
                app.style.backgroundImage = `
                url(./images/${timeOfDay}/clear.jpg)`;
                btn.style.background = "#e5ba92";
                if(timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            }
    
            else if (
                //cloudy weather
                code == 1003 ||
                code == 1006 ||
                code == 1009 ||
                code == 1030 ||
                code == 1069 ||
                code == 1087 ||
                code == 1135 ||
                code == 1273 ||
                code == 1276 ||
                code == 1279 ||
                code == 1282
            ) {
                console.log("The weather code indicates that the weather is cloudy!");
                app.style.backgroundImage = `
                url(./images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = "#fa6d1b";
                if(timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            }
    
            else if (
                //rainy weather
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1243 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252 
            ) {
                console.log("The weather code indicates that the weather is rainy!");
                app.style.backgroundImage = `
                url(./images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = "#647d75";
                if(timeOfDay == "night") {
                    btn.style.background = "#325c80";
                }
            } else {
                //snow
                console.log("Because the weather code doesn't indicate that it's rainy, cloudy or clear, we assume that it's snowing! Wohoo!");
                app.style.backgroundImage = `
                url(./images/${timeOfDay}/snowy.jpg)`;
                btn.style.background = "#4d72aa";
                if(timeOfDay == "night") {
                    btn.style.background = "#1b1b1b"
                }
                else {
                    console.log("Well, I don't know how you got here, but this means that something is really wrong.");
                    /* if before statement fails, something is definetly wrong. But just to be sure there is
                    a background, I'm adding this */
                    
                    app.style.backgroundImage = `
                    url(.images/${timeOfDay}/clear.jpg)`;
    
                    //Change button bg colors to match wallpaper
                    btn.style.background = "#e5ba92";
    
                    if(timeOfDay == "night") {
                        btn.style.background = "#181e27";
                    }
    
                }
        }
        }

        

    //Fade in the page after loading is done
    app.style.opacity = "1";

})

//If a user types a nonexistent city, alert
.catch(() => {
    alert('City not found, please try again');
    console.log("There has been an error. Client is seeing City not found, but this error could mean anything");
    app.style.opacity = "1";
});
}

//Call on page load
checkDarkMode();
fetchWeatherData();

//fetchTomorrowData();

//fade in on load
app.style.opacity = "1";