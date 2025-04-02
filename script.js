const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const API_KEY = "YOUR_API_KEY";
const searchBox = document.querySelector(".search input");
const btn = document.querySelector("#btn");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(BASE_URL + city +`&appid=${API_KEY}`);

    if(response.status == 404){
        alert("Please Enter a valid city name");
        window.addEventListener("load", checkWeather);
    }
    else{
        var data = await response.json();

        console.log(data);

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if(data.weather[0].main == "Clouds"){
            weatherIcon.src = "clouds.png";
        }else if(data.weather[0].main == "Clear"){
            weatherIcon.src = "clear.png";
        }else if(data.weather[0].main == "Drizzle"){
            weatherIcon.src = "drizzle.png";
        }else if(data.weather[0].main == "Mist"){
            weatherIcon.src = "mist.png";
        }else if(data.weather[0].main == "rain"){
            weatherIcon.src = "rain.png";
        }else if(data.weather[0].main == "Snow"){
            weatherIcon.src = "snow.png";
        }else if(data.weather[0].main == "Wind"){
            weatherIcon.src = "wind.png";
        }
    }
}


btn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});


