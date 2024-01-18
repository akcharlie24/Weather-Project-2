const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather");

const grantLocationContainer = document.querySelector(
  ".grant-location-container"
);
const userInfoContainer = document.querySelector(".user-info-container");
const loadingContainer = document.querySelector(".loading-container");
const formContainer = document.querySelector(".form-container");

let getTime = (time) => {
  let date = new Date(time * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let formattedTime = hours + ":" + minutes;
  return formattedTime;
};

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

let currentTab = userTab;

getfromSessionStorage();

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("btn-primary");
    currentTab.classList.add("btn-secondary");
    currentTab = clickedTab; //always note currentTab = clicked tab is not equal to clickedTab = currentTab
    currentTab.classList.remove("btn-secondary");
    currentTab.classList.add("btn-primary");

    if (!formContainer.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantLocationContainer.classList.remove("active");
      formContainer.classList.add("active");
    } else {
      formContainer.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantLocationContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantLocationContainer.classList.remove("active");
  loadingContainer.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch {
    loadingContainer.classList.remove("active");
    console.error("unable to fetch data , API call failed ");
    alert("api call failed to fetch data");
  }
}

async function renderWeatherInfo(weatherInfo) {
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const pressure = document.querySelector("[data-pressure]");
  const visibility = document.querySelector("[data-visibility]");
  const sunrise = document.querySelector("[data-sunrise]");
  const sunset = document.querySelector("[data-sunset]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temprature = document.querySelector("[data-currentTemp]");
  const weatherDesc = document.querySelector("[data-weatherDesc");
  let today = new Date();
  currentDate = document.querySelector("[data-currentDate]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const cityName = document.querySelector("[data-cityName]");

  console.log(weatherInfo);

  countryIcon.src = countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  cityName.innerText = `${weatherInfo?.name}`;
  currentDate.innerText = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
  temprature.innerText = `${weatherInfo?.main?.temp} °C`;
  weatherDesc.innerText =
    `${weatherInfo?.weather?.[0]?.description}`.toUpperCase();
  weatherIcon.src = `img/animated/${weatherInfo?.weather?.[0]?.icon}.svg`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  let visible = `${weatherInfo?.visibility}` / 1000;
  if (visible == 10) visibility.innerText = "Max Visibility";
  else visibility.innerText = ` ${visible} KM`;
  let sunriseVal = weatherInfo?.sys?.sunrise;
  let sunsetVal = weatherInfo?.sys?.sunset;
  sunrise.innerText = `${getTime(sunriseVal)}`;
  sunset.innerText = `${getTime(sunsetVal)}`;
  pressure.innerText = `${weatherInfo?.main.pressure / 1000} bar`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("geolocation not available try in another web browser");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantLocationButton = document.querySelector("#grant-Location-Button");
grantLocationButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

formContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingContainer.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantLocationContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    console.log(data);
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    //hW
  }
}
