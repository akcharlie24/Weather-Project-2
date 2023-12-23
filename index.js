const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather");
const grantLocation = document.querySelector("[data-grantLocation");

let currentTab = userTab;

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("btn-primary");
    currentTab.classList.add("btn-secondary");
    clickedTab = currentTab;
    currentTab.classList.remove("btn-secondary");
    currentTab.classList.add("btn-primary");
  }
}

userTab.addEventListener('click', () =>{
    switchTab(userTab);
})

searchTab.addEventListener('click', () =>{
    switchTab(searchTab);
})

console.log("hello")