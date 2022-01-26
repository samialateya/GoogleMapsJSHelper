//*import maps helper class
import {DistanceHelper} from './distance.class.js';
//? Maps helper class contains methods to simplify working with google maps SDK
export class Maps {
	//*we define the points
	#latitude;
	#longitude;
	//*drawing elements 
	#mapsDrawingArea;
	//*define attributes to hold maps and marker instances 
	#mapsInstances;
	#markerInstances;
	//*attribute to save current coordinates when it's been calculated
	#currentCoords;
	//?in the constructor we assign the attributes and insatiate the map
	constructor(latitude, longitude, mapsDrawingArea) {
		//*we catch the default coordinates to draw thw map
		this.#latitude = parseFloat(latitude) ?? 0;
		this.#longitude = parseFloat(longitude) ?? 0;
		//catch maps drawing element
		this.#mapsDrawingArea = mapsDrawingArea;
		//! use restriction bounds to draw specific part of the map
		const RESTRICTION_BOUNDS = {
			north: -34.36,
			south: -47.35,
			west: 166.28,
			east: -175.81,
		};
		//*instantiate the map
		this.#mapsInstances = new google.maps.Map(this.#mapsDrawingArea, {
			center: { lat: this.#latitude, lng: this.#longitude },
			zoom: 3,
			// restriction: {
			// 	latLngBounds: RESTRICTION_BOUNDS,
			// 	strictBounds: false,
			// },
		});
	}

	//*a getter to grab maps instance
	get mapsInstances() {
		return this.#mapsInstances;
	}

	//*fetch current user coordinates and viewed it on the map
	getCurrentLocation() {
		//!abort if the user browser dose not support geolocation
		if (!navigator.geolocation) {
			this.#infoWindow("Your browser doesn't support geolocation.");
			return;
		}
		//* get current location from the geolocation object
		navigator.geolocation.getCurrentPosition(
			//*success callback
			(position) => {
				//save current position
				this.#currentCoords = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				};
				//move map position to view the user current location
				this.changeMapPosition(this.#currentCoords.latitude, this.#currentCoords.longitude);
				//zoom in
				this.changeMapZoom(16);
				//*define a marker options to be dropped in users current location
				const markerOptions = {
					position: { lat: this.#currentCoords.latitude, lng: this.#currentCoords.longitude },
					map: this.#mapsInstances,
					icon: "http://maps.google.com/mapfiles/kml/pal3/icon40.png",
					title: "Lat: " + this.#currentCoords.latitude + ", Lng: " + this.#currentCoords.longitude,
				}
				//*draw the marker
				new google.maps.Marker(markerOptions);
			},
			//*error callback
			(error) => {
				this.#infoWindow("The Geolocation service failed.");
			},
			//*additional options
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			}
		);
	}

	//*move map position to new coordinates
	changeMapPosition(latitude, longitude) {
		this.#mapsInstances.setCenter({
			lat: latitude,
			lng: longitude,
		});
	}

	//*change maps zoom level
	changeMapZoom(zoom) {
		this.#mapsInstances.setZoom(zoom);
	}

	//*define info window to print messages to user on the map
	#infoWindow(message) {
		const infoWindow = new google.maps.InfoWindow();
		const windowPosition = this.#mapsInstances.getCenter()
		infoWindow.setPosition(windowPosition);
		infoWindow.setContent(message);
		infoWindow.open(this.#mapsInstances);
	}

	//*drop a marker on the map
	putMarker(latitude, longitude, icon) {
		const currentClass = this;
		//?if the marker is already been dropped then just change its position and exit
		if (this.#markerInstances) {
			this.#markerInstances.setPosition({
				lat: latitude,
				lng: longitude
			});
			return;
		}
		//*define marker options
		const markerOptions = {
			position: { lat: latitude, lng: longitude },
			map: this.#mapsInstances,
			icon: icon,
			title: "Lat: " + latitude + ", Lng: " + longitude,
			draggable: true,
			animation: google.maps.Animation.DROP,
			optimized: true 
		}
		//*initialize the marker and save it's instance to be used later on this class
		this.#markerInstances = new google.maps.Marker(markerOptions);
		//*define a click event to control what will happen when the user clicks on the marker
		this.#markerInstances.addListener('click', function () {
			//*in this case we just remove the marker
			currentClass.removeMarker();
		});
	}

	//*remove current dropped marker
	removeMarker(){
		this.#markerInstances.setMap(null);
		this.#markerInstances = null;
	}

	//?this method will calculate distance between current user location and the dropped marker
	calculateDistance() {
		//* abort if the user dose not locate his current location yet
		if(!this.#currentCoords){
			this.#infoWindow("Please locate your current coordinates");
			return;
		}
		//* abort if the user did not drop a marker yet
		if(!this.#markerInstances){
			this.#infoWindow("Please put a marker to calculate distance from");
			return;
		}
		//catch first point which is current user location coordinates
		const firstPoint = {
			latitude : this.#currentCoords.latitude,
			longitude : this.#currentCoords.longitude,
		}
		//catch first point which is the marker location coordinates
		const secondPoint = {
			latitude: this.#markerInstances.position.lat(),
			longitude: this.#markerInstances.position.lng(),
		}
		//*use distance class to calculate distance
		const distanceHelper = new DistanceHelper(firstPoint, secondPoint);
		const distance = distanceHelper.getCrowDistance();
		//view the distance in the info window
		this.#infoWindow(distance+" KM");
		
	}

	//*open street view in the marker location
	streetView(streetViewDrawingArea){
		//* abort if the user did not drop a marker yet
		if (!this.#markerInstances) {
			this.#infoWindow("Please put a marker to show street view");
			return false;
		}
		//initialize the panorama object to view the street view
		const panorama = new google.maps.StreetViewPanorama(
			streetViewDrawingArea,
			{
				position: { lat: this.#markerInstances.position.lat() ,lng: this.#markerInstances.position.lng()},
				pov: {
					heading: 34,
					pitch: 10,
				},
			}
		);

		//use the panorama object in our current map
		this.#mapsInstances.setStreetView(panorama);
		return true;
	}
	
}