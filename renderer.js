
function attachEvents(){
    const enterButton=document.getElementById('enterCity');
    enterButton.addEventListener('click',getCityTimeAndWeather);
}

async function getCityTimeAndWeather(){
    const inputCity = document.getElementById('cityName').value;
    const inputEmail = document.getElementById('mail').value;
    const url = `http://api.weatherapi.com/v1/current.json?key=493f7722705c44bb906133558222101&q=${inputCity}`;
    const response = await fetch(url,{method:'GET'});
    const cityInfo = await response.json();
    let output;
    if (cityInfo.error) {
      output = handleWrongCity(cityInfo);
    } else {
      output = await createOutputCityObject(cityInfo,inputEmail);
    }
    const cityDisplay=document.getElementById('cityOutput')
    cityDisplay.innerText=JSON.stringify(output);
}
 async function createOutputCityObject(city,mail) {
    let cityData = {};
    const timeAndDate = city.location.localtime;
    const timeAndDateArray = timeAndDate.split(' ');
    cityData.name = city.location.name;
    cityData.date = timeAndDateArray[0];
    cityData.time = timeAndDateArray[1];
    cityData.weather = city.current.condition.text;
    if(mail){
        window.api.send("toMain", [mail,JSON.stringify(cityData)]);
    }
    console.log(JSON.stringify(cityData));
    return JSON.stringify(cityData);
  }
  function handleWrongCity(response){
      let errorMessage={};
      errorMessage.error=response.error.message;
      console.log(JSON.stringify(errorMessage));
      return JSON.stringify(errorMessage);
  }
attachEvents();