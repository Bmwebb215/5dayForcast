

document.getElementById('searchForm').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    getWeatherData(city);
}

function getWeatherData(city) {
    const apiKey = 'b69b78e108293c4e3caf1c3f6bce6668';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the data and update the HTML
            updateWeatherUI(data);
            saveToLocalStorage(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Handle errors, e.g., show an error message to the user
        });
}

function updateWeatherUI(data) {
    // Clear previous content
    document.getElementById('currentWeather').innerHTML = '';
    document.getElementById('forecast').innerHTML = '';

    // Display current weather
    const currentWeather = data.list[0];
    const currentWeatherHTML = `
        <h2>${data.city.name}, ${data.city.country}</h2>
        <p>Date: ${currentWeather.dt_txt}</p>
        <p>Temperature: ${currentWeather.main.temp} °C</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
        <img src="http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" alt="Weather Icon">
        <!-- Add more details as needed -->
    `;
    document.getElementById('currentWeather').innerHTML = currentWeatherHTML;

    const forecastHTML = data.list
        .filter(entry => entry.dt_txt.includes('12:00:00')) 
        .map(entry => `
            <div class="city-card">
                <p>Date: ${entry.dt_txt}</p>
                <p>Temperature: ${entry.main.temp} °F</p>
                <p>Humidity: ${entry.main.humidity}%</p>
                <p>Wind Speed: ${entry.wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/w/${entry.weather[0].icon}.png" alt="Weather Icon">
            </div>
        `)
        .join('');
    document.getElementById('forecast').innerHTML = forecastHTML;
}

function saveToLocalStorage(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.unshift(city);
    searchHistory = [...new Set(searchHistory)]; 
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Update the search history UI
    updateSearchHistoryUI(searchHistory);
}

function updateSearchHistoryUI(history) {
    const historyHTML = history.map(city => `<p class="history-item">${city}</p>`).join('');
    document.getElementById('searchHistory').innerHTML = `<h3>Search History</h3>${historyHTML}`;
}
