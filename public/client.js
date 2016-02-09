City = function(name){
  this.name = name;
  this.url = '/weather/' + this.name; 
  this.data;
}
City.prototype = {
  getWeatherData: function(callback){
    var request = new XMLHttpRequest();
    request.open('GET', this.url);
    request.onload = function(){
      if (request.status === 200) {
        this.data = JSON.parse(request.responseText); 
        callback();
      } else {
        console.log('AJAX request failed to ' + this.url); 
      }
    }.bind(this);
    request.send(null);
  }
}

var getIconURL = function(icon){
  return 'http://openweathermap.org/img/w/' + icon + '.png'
}

var displayWeatherData = function(city){
  var container = document.getElementById('weather-details');
  var heading = document.getElementById('weather-details-heading');
  var body = document.getElementById('weather-details-body')

  var wind = city.data.wind;
  var weather = city.data.weather[0];
  var icon = getIconURL(weather.icon);
  var main = city.data.main;
    
  container.style.display = 'block';
  heading.innerText = city.data.name;
  //trying not to make it look like ass, didn't really help much.
  var htmlString = [
    "<p><img src='" + icon + "'><b>" + weather.main + "</b> " + weather.description + "</p>",
    "<table>",
      "<thead>",
        "<tr>",
          "<th>Metric</th>",
          "<th>Value</th>",
        "</tr>",
      "</thead",
      "<tbody>",
        "<tr>",
          "<td>Temperature</td>",
          "<td>" + main.temp + "&deg;C</td>",
        "</tr>",
        "<tr>",
          "<td>Pressure</td>",
          "<td>" + main.pressure + " hPa</td>",
        "</tr>",
        "<tr>",
          "<td>Humidity</td>",
          "<td>" + main.humidity + "%</td>",
        "</tr>",
      "</tbody",
    "</table>"
  ].join("\n");
  body.innerHTML = htmlString;

  var button = document.createElement('button');
  if (localStorage.getItem('city') == city.data.name) {
      button.disabled = true;
      button.innerText = 'City has been saved';
      button.onclick = null;
  } else {
    button.innerText = 'Save city';
    button.onclick = function(){
      localStorage.setItem('city', city.name); 
      button.disabled = true;
      button.innerText = 'City has been saved';
      button.onclick = null;
    };
  }
  body.appendChild(button);

  var position = {lat: city.data.coord.lat, lng: city.data.coord.lon};
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: position,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({
    position: position,
    map: map,
  }); 
};

var setAllCursors = function(cursor){
  nodes = document.childNodes;
  for (var i = 0, len = nodes.length; i < len; i++) {
    try {
      nodes[i].style.cursor = cursor; 
    }
    catch(err) {
    }
  }
}

var showLocalWeather = function(){
  setAllCursors('progress');
  navigator.geolocation.getCurrentPosition(function(position){
    setAllCursors('auto');
    var latlng = JSON.stringify({lat: position.coords.latitude, lng: position.coords.longitude});
    var url = '/weather/geolocation/' + latlng;
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = function(){
      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        city = new City(data.name);
        city.data = data;
        displayWeatherData(city);
      }
    };
    request.send(null);
  });
};

window.onload = function(){
  var form = document.getElementById('weather-form');
  var input = document.getElementById('city-input');
  var loadButton = document.getElementById('quick-load');
  var localButton = document.getElementById('get-location');

  loadButton.onclick = function(){
    cityName = localStorage.getItem('city');
    input.value = cityName;
    city = new City(cityName);
    city.getWeatherData(function(){
      displayWeatherData(city);
    });
  };

  form.onsubmit = function(event){
    event.preventDefault(); 
    city = new City(input.value);
    city.getWeatherData(function(){
      displayWeatherData(city);
    });
  };
  localButton.onclick = showLocalWeather;
}
