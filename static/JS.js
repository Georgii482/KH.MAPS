
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude
    const lng = position.coords.longitude
    console.log(lng + " " + lat)

    window.map = L.map("map", {
      zoomControl: false,
      maxBounds: [
        [-80, -180], 
        [85, 180], 
      ],
      maxBoundsViscosity: 1.0, 
      minZoom: 3, 
      worldCopyJump: true, 
    }).setView([lat, lng], 13)

    function locate(lat, lng) {
      const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`

      fetch(geoApiUrl)
        .then((res) => res.json())
        .then((data) => {
          const Country = data.countryName
          const City = data.principalSubdivision

          document.getElementById("Country").innerText = "Country: " + Country
          document.getElementById("City").innerText = "City: " + City

          const WetherUrlApi = `https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=cf9b466ea9280f913d6d8a0e2cccd231`
          fetch(WetherUrlApi)
            .then((res) => res.json())
            .then((data) => {
              document.getElementById("Wind").innerText = "Wind: " + data.wind.speed + " m/sec"
              document.getElementById("Temperature").innerText =
                "Temperature: " + Math.round(data.main.temp - 273.15) + "°C"
              if (data.snow) document.getElementById("Wether").innerText = "Weather: " + data.snow
              if (data.rain) document.getElementById("Wether").innerText = "Weather: " + data.rain
              document.getElementById("Sunrise").innerText =
                "Sunrise: " + new Date(data.sys.sunrise * 1000).toTimeString().split(" ")[0]
              document.getElementById("Sunset").innerText =
                "Sunset: " + new Date(data.sys.sunset * 1000).toTimeString().split(" ")[0]
            })
        })
    }

    locate(lat, lng)

    L.control.zoom({ position: "bottomleft" }).addTo(map)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      noWrap: true, 
      bounds: [
        [-80, -180], 
        [85, 180],
      ],
      maxZoom: 19,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    var drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)

    var drawControl = new L.Control.Draw({
      position: "bottomleft",
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: true,
        rectangle: true,
        circle: true,
        marker: true,
        polyline: true,
      },
    })
    map.addControl(drawControl)

    let tracking = false
    let clickHandler

    var trackButton = L.Control.extend({
      options: { position: "bottomleft" },

      onAdd: (map) => {
        var container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom")
        container.style.backgroundColor = "white"
        container.style.width = "30px"
        container.style.height = "30px"
        container.style.cursor = "pointer"
        container.innerHTML = "📍"

        container.onclick = () => {
          tracking = !tracking

          if (tracking) {
            clickHandler = (e) => {
              const newLat = e.latlng.lat
              const newLng = e.latlng.lng
              locate(newLat, newLng)
              console.log("🖱 Клік: Lat:", newLat, "Lng:", newLng)
            }

            map.on("click", clickHandler)
            container.style.backgroundColor = "#aaffaa" 
          } else {
            map.off("click", clickHandler)
            container.style.backgroundColor = "white" 
          }
        }

        return container
      },
    })

    map.addControl(new trackButton())

    var customButton = L.Control.extend({
      options: { position: "bottomleft" },
      onAdd: (map) => {
        var container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom")

        container.style.backgroundColor = "white"
        container.style.width = "30px"
        container.style.height = "30px"
        container.style.cursor = "pointer"
        container.innerHTML = "🚗"

        let routeControl = null;

        container.onclick = () => {
          if (routeControl) {
            map.removeControl(routeControl);
            routeControl = null;
            return;
          }

          const center = map.getCenter();
          const offset = 0.01;

          const pointA = L.latLng(center.lat - offset, center.lng - offset);
          const pointB = L.latLng(center.lat + offset, center.lng + offset);

          routeControl = L.Routing.control({
            waypoints: [pointA, pointB],
            routeWhileDragging: true,
            draggableWaypoints: true,
            addWaypoints: true
          }).addTo(map);
        }

        return container
      },
    })



    var customButton_2 = L.Control.extend({
      
      options: { position: "bottomleft" },
      onAdd: (map) => {
        var container_2 = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom")
        container_2.style.backgroundColor = "white"
        container_2.style.width = "30px"
        container_2.style.height = "30px"
        container_2.style.cursor = "pointer"
        container_2.innerHTML = "🎡"
        let markersVisible = false;
        const markers = [];
        container_2.onclick = () => {
          markersVisible = !markersVisible;
            if (!markersVisible) {
                markers.forEach(m => map.removeLayer(m));
                markers.length = 0;
                return;
          }
          fetch('http://localhost:3000/users')
          .then(res => res.json())
          .then(data => {
            const user = data.find(user => user.name === emailFromServer);
            if(user.choice == "Human-made"){
              const sofiaLat = 50.4525
              const sofiaLng = 30.5144
              map.setView([sofiaLat, sofiaLng], 16)
              markers.push(
              L.marker([sofiaLat, sofiaLng])
                .addTo(map)
                .bindPopup("<b>Софійський собор</b><br>Київ, Україна")
                .openPopup()
              );
              markers.push(
              L.marker([48.8584, 2.2945]) 
                .addTo(map)
                .bindPopup("<b>Ейфелева вежа</b><br>Париж, Франція")
              );
              markers.push(
              L.marker([40.6892, -74.0445]) 
                .addTo(map)
                .bindPopup("<b>Статуя Свободи</b><br>Нью-Йорк, США")
              );
              markers.push(
              L.marker([35.6586, 139.7454]) 
                .addTo(map)
                .bindPopup("<b>Токійська вежа</b><br>Токіо, Японія"));
              markers.push(
              L.marker([27.1751, 78.0421]) 
                .addTo(map)
                .bindPopup("<b>Тадж-Махал</b><br>Агра, Індія"));
            }else{if(user.choice == "Natural-tourist"){
              const sofiaLat = 48.65
              const sofiaLng = 25.735
              map.setView([sofiaLat, sofiaLng], 16)
              markers.push(L.marker([sofiaLat, sofiaLng])
                .addTo(map)
                .bindPopup("<b>Дністровський каньйон</b><br>Тернопільська область, Україна")
                .openPopup());

              markers.push(L.marker([-25.3444, 131.0369])
                .addTo(map)
                .bindPopup("<b>Улуру</b><br>Австралія"));

              markers.push(L.marker([-13.1631, -72.5450])
                .addTo(map)
                .bindPopup("<b>Мачу-Пікчу</b><br>Перу"));

              markers.push(L.marker([36.1069, -112.1129])
                .addTo(map)
                .bindPopup("<b>Гранд-Каньйон</b><br>Аризона, США"));

              markers.push(L.marker([56.8012, -5.1122])
                .addTo(map)
                .bindPopup("<b>Глен-Коу</b><br>Шотландія, Велика Британія"));
            }else{if(user.choice == "Novelty"){
              const sofiaLat = 50.75059
              const sofiaLng = 26.04397
              map.setView([sofiaLat, sofiaLng], 16)
              markers.push(L.marker([sofiaLat, sofiaLng])
                .addTo(map)
                .bindPopup("<b>Тунель кохання</b><br>Рівенська область, Україна")
                .openPopup());

              markers.push(L.marker([37.4219, -122.0840])
                .addTo(map)
                .bindPopup("<b>Штаб-квартира Google</b><br>Каліфорнія, США"));

              markers.push(L.marker([64.9631, -19.0208])
                .addTo(map)
                .bindPopup("<b>Блакитна лагуна</b><br>Ісландія"));

              markers.push(L.marker([25.2048, 55.2708])
                .addTo(map)
                .bindPopup("<b>Dubai Miracle Garden</b><br>ОАЕ"));

              markers.push(L.marker([60.1699, 24.9384])
                .addTo(map)
                .bindPopup("<b>Село саун</b><br>Гельсінкі, Фінляндія"));
            }else{if(user.choice == "Cultural-tourist"){
              const sofiaLat = 50.3599
              const sofiaLng = 30.5163
              map.setView([sofiaLat, sofiaLng], 16)
              markers.push(L.marker([sofiaLat, sofiaLng])
                .addTo(map)
                .bindPopup("<b>Пирогів</b><br>Київ, Україна")
                .openPopup());

              markers.push(L.marker([35.6895, 139.6917])
                .addTo(map)
                .bindPopup("<b>Саня Мацурі</b><br>Токіо, Японія"));

              markers.push(L.marker([48.2100, 16.3634])
                .addTo(map)
                .bindPopup("<b>Віденський бал</b><br>Відень, Австрія"));

              markers.push(L.marker([41.9028, 12.4964])
                .addTo(map)
                .bindPopup("<b>Карнавал у Римі</b><br>Італія"));

              markers.push(L.marker([-22.9068, -43.1729])
                .addTo(map)
                .bindPopup("<b>Карнавал у Ріо</b><br>Бразилія"));
              }}}}

          })
          .catch(err => console.error('Помилка запиту:', err));
        }

        return container_2
      },
    })

    map.addControl(new customButton())
    map.addControl(new customButton_2())

    map.on(L.Draw.Event.CREATED, (e) => {
      var layer = e.layer
      drawnItems.addLayer(layer)
    })
  },

  (error) => {
    const lat = 0
    const lng = 0
    console.error("Помилка отримання місця:", error)

    var map = L.map("map", {
      maxBounds: [
        [-80, -180],
        [85, 180],
      ],
      maxBoundsViscosity: 1.0,
      minZoom: 3,
      worldCopyJump: true,
    }).setView([lat, lng], 3)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      noWrap: true,
      bounds: [
        [-80, -180],
        [85, 180],
      ],
      maxZoom: 19,
      minZoom: 3,
    }).addTo(map)

    L.Routing.control({
      waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
    }).addTo(map)
  },
)
document.addEventListener('DOMContentLoaded', function() {
    const searchContainer = document.querySelector('.search-container');
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    
    searchButton.addEventListener('click', function(e) {
      searchContainer.classList.toggle('active');
      
      if (searchContainer.classList.contains('active')) {
        searchInput.focus();
      } else {
        if (searchInput.value.trim() !== '') {
          performSearch(searchInput.value);
        }
      }
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        performSearch(searchInput.value);
      }
    });
    
    document.addEventListener('click', function(e) {
      if (!searchContainer.contains(e.target)) {
        searchContainer.classList.remove('active');
      }
    });
    
    function performSearch(query) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat_2 = parseFloat(data[0].lat);
            const lon_2 = parseFloat(data[0].lon);
            map.setView([lat_2, lon_2], 13);
          } else {
            alert("Place not found");
          }
        })
        .catch(err => {
          console.error("Geocoding error:", err);
          alert("An error occurred while searching");
        });
    }
  });