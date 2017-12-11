
//globals
var map;
var service;
var infowindow;
var usrLoc;
var typedLoc;
var pickedLoc;
var allData = [];
var markers = [];

//update the map on slide 4	
function myMap() {
	//setup basic map style
	
	//console.log("called myMap");
	var mapProp= {
    	center: pickedLoc,
		zoom:13,//looks good to me
	};
	map = new google.maps.Map(document.getElementById("mapContainer"),mapProp);
	
	google.maps.event.trigger(map, 'resize');
	map.setZoom( map.getZoom() );
	//add you are here marker
	addMarker(pickedLoc.lat(),pickedLoc.lng(),"You are here!");
  
	
	

}//end myMap

//makes a marker object and attaches it to the map	
	function addMarker(latitude,longitude,title){
		//console.log("called add marker" + latitude, longitude, title);
		var position = {lat:latitude,lng:longitude};
		var marker = new google.maps.Marker({position:position,map:map});
		marker.setTitle(title);
		
		markers.push(marker);
		
		google.maps.event.addListener(marker,'click',function(e){
			makeInfoWindow(this.position,this.title);
		});
	}
		
	//info window helper
	function makeInfoWindow(position,msg){
		//close the window if it exists
		if(infowindow) infowindow.close();
		
		//make a new info window
		infowindow = new google.maps.InfoWindow({
			map:map,
			position: position,
			content: "<b>" + msg + "<b>"
		});
	}
	
	//clear all markers
	function clearMarkers(){
		markers.forEach(function(marker){
			marker.setMap(null);
		});
		
		markers = [];
	}

//search google api for places nearby
function findPlaces(placeNum){
	myMap();
	//places query
	allData = [];//clear array
	service = new google.maps.places.PlacesService(map);
	var radiusInMeters = document.getElementById('mileRad').value * 1609.34;//get meters from miles
	var maxPrice = document.querySelector('input[name="price"]:checked').value;

	//make a request object
	var request = {
    location: pickedLoc,
    radius: radiusInMeters,//in meters
    type: ['restaurant'],
	openNow : true,
	maxPriceLevel : maxPrice//restricts results to a max price 0-4
  	};
  	service.nearbySearch(request, callback);
	
	//runs with data after the nearbySearch
function callback(results, status) {
	//console.dir(status);
	//console.dir(results);
	document.querySelector('#title').innerHTML = "Found " + results.length + " places";
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      //console.dir(results[i]);
	  allData.push(results[i]);
    }
	 populateData(placeNum);//type num is placeNum
  }
	if(status == google.maps.places.PlacesServiceStatus.Zero_Results){
		console.log("No Results for your area")
	}//end NO RESULTS
}//end callback
}//end find places

//populates the data to the page	
function populateData(type){
	if(type === 1){
		document.querySelector('#dataResults').innerHTML ="";//clear the section
		var randomIndex = Math.floor(Math.random()*allData.length);
		console.dir(allData[randomIndex]);
		console.log(allData[randomIndex].geometry.location.lat(),allData[randomIndex].geometry.location.lng());
		addMarker(allData[randomIndex].geometry.location.lat(),allData[randomIndex].geometry.location.lng(),allData[randomIndex].name);
		var section = document.createElement('section');
		var container = document.createElement('div');
		container.className = 'contentEven';
		
		var title = document.createElement('h2');
			var address = document.createElement('p');
			var rating = document.createElement('h3');
			var price = document.createElement('p');
			var button = document.createElement('button');
			
			//add text content
			
			title.textContent = allData[randomIndex].name;
			address.textContent = allData[randomIndex].vicinity;
			rating.textContent = allData[randomIndex].rating;
			switch(allData[randomIndex].price_level){
				case 1:
					price.textContent = "$";
					break;
				case 2:
					price.textContent = "$$";
					break;
				case 3:
					price.textContent = "$$$";
					break;
				case 4:
					price.textContent = "$$$$";
					break;
				default:
					price.textContent = "Unknown Price Point";
					break;
			}
			//link all the DOM elements
			
			container.appendChild(title);
			container.appendChild(rating);
			container.appendChild(price);
			container.appendChild(address);
			if(allData.length > 1){
				button.textContent = "What else is there?";
				button.onclick = function(){
					populateData(1);
				}
				button.className = 'resultsButton';
				container.appendChild(button);
			}
			allData.splice(randomIndex,1);//remove that place from the data array
			
			section.appendChild(container);
			document.querySelector('#dataResults').appendChild(section);
		
	}
	if (type === 0){
		document.querySelector('#dataResults').innerHTML ="";//clear the section
		var section = document.createElement('section');
		for(var i = 0; i < allData.length; i++){
			var container = document.createElement('div');
			if(i%2 === 0){
				container.className = 'contentEven';
			}
			else{
				container.className = 'contentOdd';
			}
			var title = document.createElement('h2');
			var address = document.createElement('p');
			var rating = document.createElement('h3');
			var price = document.createElement('p');
			
			//add text content
			title.textContent = allData[i].name;
			address.textContent = allData[i].vicinity;
			rating.textContent = allData[i].rating;
			switch(allData[i].price_level){
				case 1:
					price.textContent = "$";
					break;
				case 2:
					price.textContent = "$$";
					break;
				case 3:
					price.textContent = "$$$";
					break;
				case 4:
					price.textContent = "$$$$";
					break;
				default:
					price.textContent = "Unknown Price Point";
					break;
			}
			//link all the DOM elements
			
			container.appendChild(title);
			container.appendChild(rating);
			container.appendChild(price);
			container.appendChild(address);
			
			section.appendChild(container);
			document.querySelector('#dataResults').appendChild(section);
		}
	}
	myMap();
}//end populateData()	
		
//make a map arround the users position
function checkPosition(position) {
	//console.log("Found Device @:");
    //console.log("Latitude: " + position.coords.latitude ); 
    //console.log("Longitude: " + position.coords.longitude);
	document.querySelector('#useMyLoca').disabled = false;//endable the use my location feature
	document.querySelector('#useMyLoca').innerHTML = "Use my Location";//change button text
	usrLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);//store the users location in pyrmont
	
}

      // This example displays an address form, using the autocomplete feature
      // of the Google Places API to help users fill in the information.

      var placeSearch, autocomplete;
  

	  //callback from when google maps loads
      function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', useAddress);
      }
		//populate form with data
      function useAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
		var locaLat = place.geometry.location.lat();
		var locaLng = place.geometry.location.lng();
		  
		  //console.log(locaLat,locaLng);
		  typedLoc = new google.maps.LatLng(locaLat,locaLng);//store the users location in typedLoc
		  myMap();//make a new map object
      }

      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }
	
	
	
	//attempt to get the location of this device
	function getPermision() {
		if (navigator.geolocation){
			//console.log("Device has location services");
			try{
				document.querySelector('#useMyLoca').innerHTML = "One Sec we're finding you!";//change button text
				navigator.geolocation.getCurrentPosition(checkPosition);
			}
			finally{
				document.querySelector('#useMyLoca').innerHTML = "Trying to find your location";//change button text	
			}
		} else {
			document.querySelector('#useMyLoca').disabled;//disable the use my location feature and force a typed address
			window.alert("Geolocation is not supported by this browser. You can still enter in any address.");
		}
	}

		window.onload = function(){
			getPermision();//try and use the devices location
			document.querySelector('#useMyLoca').onclick = function(){
				pickedLoc = usrLoc;//use the users location
			
			}
			document.querySelector('#pickedAddress').onclick = function(){
				pickedLoc = typedLoc;
				
			}
		}