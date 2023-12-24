const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather");

const grantLocationContainer = document.querySelector(
  ".grant-location-container"
);
const userInfoContainer = document.querySelector(".user-info-container");
const loadingContainer = document.querySelector(".loading-container");
const formContainer = document.querySelector(".form-container");

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
  } 
  else {
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
  } 
  
  catch {
    loadingScreen.classList.remove("active");
    console.error("unable to fetch data , API call failed ");
    alert("api call failed to fetch data")
  }
}

async function renderWeatherInfo(weatherInfo) {

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

grantLocationButton.addEventListener('click', getLocation());