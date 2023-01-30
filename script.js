//  Interação -> o usuário vai ter interação com isso, que é o botão e a barra de pesquisa
const citySearchInput = document.getElementById('city-search-input')
const citySearchButton = document.getElementById('city-search-button')

//  Exibição -> elementos que vão ser substituidos, mas o usuario não vai interagir, apenas ver
const currentDate = document.getElementById('current-date');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const currentTemperature = document.getElementById('current-temperature');
const windSpeed = document.getElementById("wind-speed");
const feelsLikeTemperature = document.getElementById("feels-like-temperature");
const currentHumidity = document.getElementById("current-humidity");
const sunriseTime = document.getElementById("sunrise-time");
const sunsetTime = document.getElementById("sunset-time");

const api_key = "bed48e95b379f7cdefd5f2e754e5c1ac"

citySearchButton.addEventListener("click", () => {
   
   let cityName = citySearchInput.value //toda vez que apertar o botão de input, o que está escrito vai vim até está função. Se usar const no lugar do let, vai dar problema porque quando digita no input, o value vai ser alterado, ele não vai ser um valor fixo
    getCityWeather(cityName)

})
 //essa função vai fazer com que na hora que você entrar, o navegador vai te perguntar se você aceita mostrar a sua localização
navigator.geolocation.getCurrentPosition(
    (position) => { //quando permirtir, ele vai exibir isso
        let lat = position.coords.latitude
        let lon = position.coords.longitude

        getCurrentLocationWather(lat, lon)
        
    },
    (err) => {
        if(err.code === 1) {
        alert("Geolocalização negada pelo usuário, busque manualmente por uma cidade através da barra de pesquisa.")
        } else {
        console.log(err)
    }
  }//quando não permitir, ele exibi isso
) //RESUMO: se nossa função for executada com sucesso, ela vai retornar a posição, se algo der errado, ela vai exibir um erro no console

function getCurrentLocationWather( lat, lon){ //função encarregada em buscar a temperatura no momento que o usuário carrega a página
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`)
        .then((response) => response.json())   //quando usamos o crase ``, é possivel colocar no meio, uma variavel
        .then((data) => displayWeather(data))
}

function getCityWeather(cityName){
    weatherIcon.src = `./assets/loading-icon.svg` 

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${api_key}`)
  .then((response) => response.json())   //quando usamos o crase ``, é possivel colocar no meio, uma variavel
  .then((data) => displayWeather(data))
}
function displayWeather(data) {
    let {
        dt,
        name,
        weather:[{icon, description}],
        main: {temp, feels_like, humidity},
        wind: {speed},
        sys: {sunrise, sunset},
        } = data

        currentDate.textContent = formatDate(dt);
        cityName.textContent = name;
        weatherIcon.src = `./assets/${icon}.svg` // isso vai fazer com que sua imagem troque conforme o necessário
        weatherDescription.textContent = description;
        currentTemperature.textContent = `${Math.round(temp)}°C`;
        windSpeed.textContent = `${Math.round(speed * 3.6)}Km/h`;
        feelsLikeTemperature.textContent = `${Math.round(feels_like)}°C`;
        currentHumidity.textContent = `${humidity}%`;
        sunriseTime.textContent = formatTime(sunrise);
        sunsetTime.textContent = formatTime(sunset);
    }
    function formatDate(epochTime) {
        let date = new Date(epochTime * 1000)

        let formattedDate = date.toLocaleDateString('pt-br', {month:"long", day:'numeric'}) // vai pegar o formato da data e transformar que a gente quer

        return `Hoje, ${formattedDate}`
    }
    function formatTime(epochTime){
        let date = new Date(epochTime)
        let hours = date.getHours()
        let minutes = date.getMinutes()
        return `${hours}:${minutes}` 
    }