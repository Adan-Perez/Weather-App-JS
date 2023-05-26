// Element selectors
const iconElement = document.querySelector('.weather-icon'),
  tempElement = document.querySelector('.temperature-value p'),
  descElement = document.querySelector('.temperature-description p'),
  locationElement = document.querySelector('.location p'),
  notificationElement = document.querySelector('.notification'),
  titleElement = document.querySelector('.app-title'),
  infoElement = document.querySelector('.temperature-info');

// App data
const weather = {
  temperature: {
    unit: 'celsius',
  },
};

const Kelvin = 273;
const apiKey = 'YOUR API KEY';

// Language texts
const texts = {
  en: {
    error: "Browser doesn't support Geolocation",
  },
  es: {
    'Weather App': 'Aplicación del tiempo',
    error: 'El navegador no admite geolocalización',
    'User denied Geolocation': 'El usuario denegó la geolocalización',
    'Position unavailable': 'Posición no disponible',
    'No data': 'Sin datos',
    'Click on the number to change the temperature unit': 'Haz clic en el número para cambiar la unidad de temperatura',
    'broken clouds': 'Nubes rotas',
    'overcast clouds': 'Nubes cubiertas',
    'few clouds': 'Pocas nubes',
    'scattered clouds': 'Nubes dispersas',
    'light rain': 'Lluvia ligera',
    'moderate rain': 'Lluvia moderada',
    'heavy intensity rain': 'Lluvia de intensidad fuerte',
    'very heavy rain': 'Lluvia muy fuerte',
    'extreme rain': 'Lluvia extrema',
    'freezing rain': 'Lluvia helada',
    'light intensity shower rain': 'Lluvia ligera de intensidad',
    'shower rain': 'Lluvia de ducha',
    'heavy intensity shower rain': 'Lluvia de intensidad fuerte',
    'ragged shower rain': 'Lluvia de ducha desigual',
    'thunderstorm with light rain': 'Tormenta con lluvia ligera',
    'thunderstorm with rain': 'Tormenta con lluvia',
    'thunderstorm with heavy rain': 'Tormenta con lluvia fuerte',
    'light thunderstorm': 'Tormenta ligera',
    thunderstorm: 'Tormenta',
    'heavy thunderstorm': 'Tormenta fuerte',
    'ragged thunderstorm': 'Tormenta desigual',
    'thunderstorm with light drizzle': 'Tormenta con llovizna ligera',
    'thunderstorm with drizzle': 'Tormenta con llovizna',
    'thunderstorm with heavy drizzle': 'Tormenta con llovizna fuerte',
    'light snow': 'Nieve ligera',
    Snow: 'Nieve',
    'Heavy snow': 'Nieve fuerte',
    Sleet: 'Aguanieve',
    'Light shower sleet': 'Lluvia ligera de aguanieve',
    'Shower sleet': 'Lluvia de aguanieve',
    'Light rain and snow': 'Lluvia ligera y nieve',
    'Rain and snow': 'Lluvia y nieve',
  },
};

// Get user's language
let language = navigator.language.split('-')[0];

// Translate text
function translate(text) {
  return texts[language][text] || text;
}

// Language buttons
const langBtns = document.querySelectorAll('.lang-btn');

// Set language and refresh weather
function setLanguage(lang) {
  language = lang;
  displayWeather();
}

// Event listener for language buttons
langBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selectedLanguage = btn.id === 'lang-es' ? 'es' : 'en';
    setLanguage(selectedLanguage);
  });
});

// Check if browser supports geolocation
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(getPosition, showError);
} else {
  displayErrorMessage(translate('error'));
}

// Get user's position
function getPosition(position) {
  const { latitude, longitude } = position.coords;
  getWeather(latitude, longitude);
}

// Show error when there is an issue with geolocation service
function showError(error) {
  displayErrorMessage(error.message);
}

// Display error message
function displayErrorMessage(message) {
  notificationElement.style.display = 'block';
  notificationElement.innerHTML = `<h2>${translate(message)}</h2>`;
}

// Get weather from API provider
function getWeather(latitude, longitude) {
  const api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      weather.temperature.value = Math.floor(data.main.temp - Kelvin);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(displayWeather);
}

// Display weather to UI
function displayWeather() {
  titleElement.innerHTML = `<h2>${translate('Weather App')}</h2>`;

  if (!weather.iconId) {
    iconElement.innerHTML = `<img src="icons/unknown.png"/>`;
    tempElement.innerHTML = '☹' || '0';
    descElement.innerHTML = '';
    locationElement.innerHTML = translate('Position unavailable');
  } else {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>${getTemperatureUnit()}</span>`;
    descElement.innerHTML = translate(weather.description);
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
  }

  infoElement.innerHTML = `${translate('Click on the number to change the temperature unit')}`;
}

// Toggle temperature unit between Celsius and Fahrenheit
function toggleTemperatureUnit() {
  if (weather.temperature.unit === 'celsius') {
    const fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    tempElement.innerHTML = `${Math.floor(fahrenheit)}°<span>F</span>`;
    weather.temperature.unit = 'fahrenheit';
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = 'celsius';
  }
}

// Celsius to Fahrenheit conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

// Get the current temperature unit
function getTemperatureUnit() {
  return weather.temperature.unit === 'celsius' ? 'C' : 'F';
}

// Event listener for temperature element click
tempElement.addEventListener('click', function () {
  if (weather.temperature.value !== undefined) {
    toggleTemperatureUnit();
  }
});
