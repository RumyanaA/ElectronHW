function handleWrongCity(response) {
  const errorMessage = {};
  errorMessage.error = response.error.message;
  window.api.send('writeFile', [errorMessage.error]);
  console.log(JSON.stringify(errorMessage));
  return JSON.stringify(errorMessage);
}
async function createOutputCityObject(city, mail) {
  const cityData = {};
  const timeAndDate = city.location.localtime;
  const timeAndDateArray = timeAndDate.split(' ');
  cityData.name = city.location.name;
  [cityData.date, cityData.time] = [timeAndDateArray[0], timeAndDateArray[1]];
  cityData.weather = city.current.condition.text;
  if (mail) {
    window.api.send('sendMail', [mail, JSON.stringify(cityData)]);
  }
  window.api.send('writeFile', [JSON.stringify(cityData)]);
  console.log(JSON.stringify(cityData));
  return JSON.stringify(cityData);
}
async function getCityTimeAndWeather() {
  const inputCity = document.getElementById('cityName').value;
  const inputEmail = document.getElementById('mail').value;
  const url = `http://api.weatherapi.com/v1/current.json?key=493f7722705c44bb906133558222101&q=${inputCity}`;
  const response = await fetch(url, { method: 'GET' });
  const cityInfo = await response.json();
  let output;
  if (cityInfo.error) {
    output = handleWrongCity(cityInfo);
  } else {
    output = await createOutputCityObject(cityInfo, inputEmail);
  }
  const cityDisplay = document.getElementById('cityOutput');
  cityDisplay.innerText = JSON.stringify(output);
}

function attachEvents() {
  const enterButton = document.getElementById('enterCity');
  enterButton.addEventListener('click', getCityTimeAndWeather);
}
attachEvents();
