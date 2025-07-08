const APIKEY = "36519ab263cf45d0a03ad36fb951059e";

const APIURL = "http://api.openweathermap.org/data/2.5/weather?";


const cityName = document.getElementById('cityInput');
const weatherDisplay = document.getElementById("weatherDisplay");
const weatherCity = document.getElementById("weatherCity");
const weatherInfo = document.getElementById("weatherInfo");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const spinner = document.getElementById("spinner");



async function getForecast(params) {
  try {
    const city = cityName.value;

    spinner.classList.remove("hidden");

    const res = await fetch(`${APIURL}q=${city}&appid=${APIKEY}&units=metric`);

    if (!res.ok) {
      throw new Error("City not found, check correct city and try again!");
    } else if (city === "") {
      throw new Error("Please input a valid City!")
    }
 

    const data = await res.json();

    const temp = data.main.temp;
    const condition = data.weather[0].main;
    const wind = data.wind.speed;
    const {
      main:{
        temp_min,
        temp_max,
        humidity,
        main
      }
    } = data;

    console.log(temp_min, temp_max, humidity, condition);
    //Updating Dom
    weatherCity.textContent = `Weather in ${data.name}`;
    weatherInfo.textContent = `${temp}°C, ${condition} | Wind: ${wind} m/s | Temp-range:${temp_min}-${temp_max}°C | Humidity: ${humidity}%`;

    weatherDisplay.classList.remove("hidden");

    showClothingAdvice(temp, condition, wind);

  } catch (error) {
    alert(error.message);
  } finally {
    spinner.classList.add("hidden");
  }
  
  
}

async function getCurrentLocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  try {
    spinner.classList.remove("hidden");

    const res = await fetch(`${APIURL}lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`);
  
    if (!res.ok) {
      throw new Error("Location not found, try again!");
    }
  
    const data = await res.json();

    const temp = data.main.temp;
    const condition = data.weather[0].main;
    const wind = data.wind.speed;
    const {
      main:{
        temp_min,
        temp_max,
        humidity,
        main
      }
    } = data;

    console.log(temp_min, temp_max, humidity, condition);

    //Updating Dom
    weatherCity.textContent = `Weather in ${data.name}`;
    weatherInfo.textContent = `${temp}°C, ${condition} | Wind: ${wind} m/s | Temp-range:${temp_min}-${temp_max}°C | Humidity: ${humidity}%`;

    weatherDisplay.classList.remove("hidden");

    showClothingAdvice(temp, condition, wind);

  } catch (error) {
    alert(error.message);
  } finally{
    spinner.classList.add("hidden");
  }
}

function errorLocation() {
  alert("Unable to retrieve your location.");
}

// Use Location
function useLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCurrentLocation, errorLocation);
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};


// Clothing Advice
const clothingDisplay = document.getElementById("clothingDisplay");
const clothingAdvice = document.getElementById("clothingAdvice");

function showClothingAdvice(temp, condition, wind) {
  let advice = [];

  // Temperature-based suggestions
  if (temp < 5) {
    advice.push("🧥 Heavy jacket or Hoodie, socks, and gloves");
  } else if (temp < 12) {
    advice.push("🧥 Jacket or warm Hoodie");
  } else if (temp < 18) {
    advice.push("👕 Light jacket or long sleeves");
  } else if (temp < 25 || condition.toLowerCase().includes("rain")) {
    advice.push("👕 T-shirt and jeans or warmer Clothing if it's raining");
  } else if(temp > 25) {
    advice.push("🩳 Shorts and a light shirt or warmer Clothing if it's raining");
  }

  // Rain condition
  if (
    condition.toLowerCase().includes("rain") ||
    condition.toLowerCase().includes("clouds") || 
    condition.toLowerCase().includes("drizzling") || 
    condition.toLowerCase().includes("thunderstorm")
  ) {
    advice.push("You should bring an umbrella☔  or raincoat");
  }

  // Snow condition
  if (condition.toLowerCase().includes("snow")) {
    advice.push("❄️ Wear waterproof boots and warm layers");
  }

  // Windy condition
  if (wind > 7) {
    advice.push("💨 Wear a windbreaker, it’s breezy");
  }

  // Final output
  clothingAdvice.textContent = advice.join(". ") + ".";
  clothingDisplay.classList.remove("hidden");
}

// Event Listeners
searchBtn.addEventListener("click", getForecast);
locationBtn.addEventListener("click", useLocation);
// getForecast();


