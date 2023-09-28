// map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// build leaflet map
	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		});

		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)

		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()

		const latlngs =[[this.coordinates],[this.coordinates],[this.coordinates],[this.coordinates], [this.coordinates]] 
        const polygon = L.polygon(latlngs, {
			 color: 'blue',
		     fillOpacity: 0.0 
			}).addTo(this.myMap)

			// const redPin = L.icon({
			// 	    iconUrl: './assests/red-pin.png',
			// 	    iconSize:     [38, 38], // size of the icon
			// 	    iconAnchor:   [19, 38], // point of the icon which will correspond to marker's location
			// 	    popupAnchor:  [0, -38] // point from which the popup should open relative to the iconAnchor
			// 	});

// form categories
const restaurants = L.layerGroup([]).addTo(this.map);
const coffeeShpos = L.layerGroup([]).addTo(this.map);
const hotels = L.layerGroup([]).addTo(this.map);
const markets = L.layerGroup([]).addTo(this.map);

return [ L.layerGroup([restaurants, coffeeShpos,hotels, markets]).addTo(myMap)];

	},

	// add business markers
	addMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

//get coordinates via geolocation api
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}


// get foursquare businesses
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	
	return businesses
}



// near me
function processBusinesses(data) {
	let businesses = data.map((element) => {
	  let location = {
		name: element.name,
		lat: element.geocodes.main.latitude,
		long: element.geocodes.main.longitude,
	  };
	  return location;
	});
	return businesses;
  }
  
// event handlers
// window load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
});



	