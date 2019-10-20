/**
 * 
 *   Google Maps Handling Script
 *   map.js
 * 
 *   Created By Jayant Waldia
 * 
 */


// Global Reference the Map Object & User Position
var map;
var userPosition;
var destinationCoordinates = {lat: 51.533261, lng: -0.126003};

// Global Map Services
var directionsDisplay;
var directionsService;
var distanceService;


/**
 * @function InitMap
 * @description This function intialises and configures the map
 */
function initMap() {

    // Initialises map and configures all it's needed services 
    configureMapAndServices();

    // DONE: Add Marker on Google UK Offices as Destination
    setMarkerOnDestination();

    /* 
     * DONE: Get And Set User's Geolocation on Map With Custom Marker
     * initialiseUserLocation() Called from index.html to prevent bug (1 - Bugs.md) 
     */

    /* 
     * DONE: Setup Distance Service to get travel time from Users Location to Google Offices using
     * initialiseDirectionService() which is called from index.html on click of 'Go' button
     */ 
}


/**
 * @function configureMapAndServices
 * @description Initialises map and configures needed services globally
 */
function configureMapAndServices() {

    // Create the Map Object & Assign it Globally
    map = new google.maps.Map(document.getElementById('map'), {
        center: destinationCoordinates,
        zoom: 10
    });

    // Initialise direction service to get travel time and distance
    distanceService = new google.maps.DistanceMatrixService();

    // Initialise direction service and displayer for map
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
}


/**
 * @function initialiseDirectionService
 * @description Makes a request to API's direction service for directions, departure time and arrival time
 * @param {String} travelMode Holds the travel mode for which to render directions for.
 */
function initialiseDirectionService(travelMode) {

    // Get the elements label elements for the times to update
    var arrivalTime     = document.getElementById("arrival-time");
    var departureTime   = document.getElementById("departure-time");

    // Make request for directions and pass in travelMode
    directionsService.route({
        origin: userPosition,
        destination: destinationCoordinates,
        travelMode: travelMode,
        transitOptions: []

    // Handle callback response depending on if status returned is "OK"
    }, function (res, status) {
        if (status == "OK") {

            // Render directions onto map and display collapsable panel with routes
            directionsDisplay.setDirections(res);
            directionsDisplay.setPanel(document.getElementById('panelCollapse'));

            // Update the departure and arrival time labels in menu
            if (travelMode == "TRANSIT") { 
                arrivalTime.innerHTML   = res.routes[0].legs[0].arrival_time.text;
                departureTime.innerHTML =  res.routes[0].legs[0].departure_time.text;
            }
        
        // If an error occured while getting directions then display error in footer
        } else { 
            footerAlert("error-footer", "Error: Something went wrong displaying directions to destination.");
        }
    });
}


/**
 * @function displayExtraTransitFields
 * @description Show's transit mode dropdown if transit mode is "Transit"
 */
function displayExtraTransitFields() {
    
    // Declare dropdown inputs needed
    var transitTypeDropdown = $("#transit-dropdown").val().toUpperCase();
    var transitModeDropdown = document.getElementById("transit-mode-dropdown");
    var departureTime       = document.getElementById("departure-info");

    // If the transit type is not "Transit" then hide the transit mode dropdown
    if (transitTypeDropdown == "TRANSIT") {
        transitModeDropdown.classList.remove("hidden");
        departureTime.classList.remove("destroy");
    } else {
        transitModeDropdown.classList.add("hidden");
        departureTime.classList.add("destroy");
    }
}


/**
 * @function initialiseDistanceService
 * @description Computes travel distance and journey duration between multiple origins and destinations using a given mode of travel
 */
function initialiseDistanceService() {

    // Declare Distance Object & Origin points
    var startingOrigin  = userPosition;
    var endingOrigin    = destinationCoordinates;
    var transitType     = $("#transit-dropdown").val().toUpperCase();
    var transitMode     = $("#transit-mode-dropdown").val().toUpperCase();

    // Change 'Go' button text to 'Update' to allow people to update their travel config
    document.getElementById("go-btn").innerHTML = "Update"

    // Make a request to distance matrix service  if the user did not choose a transit mode
    if (transitMode == "EMPTY") {

        distanceService.getDistanceMatrix({
            origins:        [endingOrigin, startingOrigin],
            destinations:   [startingOrigin, endingOrigin],
            travelMode:     transitType,
            unitSystem:     google.maps.UnitSystem.METRIC
        // Callback to handle any errors with getting distance
        }, function (res, status) {
            // Callback which handles the success and error repsonse of this request
            handleDistanceMatrixResult(res, status);
            // Initialises Directions Service from Users Location to Google Offices
            initialiseDirectionService(transitType);
        });
    
    // This else branch will run if the user chose transit type with a tansit mode
    } else {

        distanceService.getDistanceMatrix({
            origins:        [endingOrigin, startingOrigin],
            destinations:   [startingOrigin, endingOrigin],
            travelMode:     transitType,
            unitSystem:     google.maps.UnitSystem.METRIC,
            transitOptions: { modes: [transitMode] } 
        }, function (res, status) {
            // Callback which handles the success and error repsonse of this request
            handleDistanceMatrixResult(res, status);
            // Initialises Directions Service from Users Location to Google Offices
            initialiseDirectionService(transitType);
        });
    }
}


/**
 * @function handleDistanceMatrixResult
 * @description This handles the error and success scenario of the distance matrix response
 * @param {Object} res Response from distance matrix service request
 * @param {String} status Status of distance matrix service request e.g. "OK", "NOT_FONUD" etc.
 */
function handleDistanceMatrixResult(res, status) {

    // If an response is not "OK" then an error occured and is reflected in footer
    if (status != "OK") {
        footerAlert("error-footer", "Error: Something went wrong getting distance info!");

    // If status is "OK" then no error occured and we can get duration and distance then update it in the UI
    } else {
        var travelTime     = res.rows[0].elements[0].duration["text"];
        var travelDistance = res.rows[0].elements[0].distance["text"]
        document.getElementById("travel-time").innerHTML = travelTime;
        document.getElementById("travel-distance").innerHTML = travelDistance;
    }
}


/**
 * @function setMarkerOnDestination
 * @description Puts a marker on the destination (Google UK)
 */
function setMarkerOnDestination() {
    new google.maps.Marker({
        position: destinationCoordinates,
        map: map
    });
}


/**
 * @function initialiseUserLocation
 * @description Get's user's location through browser geolocation API
 * @returns {Array} Latitude & Longtitude
 */
function initialiseUserLocation() {

    // If the geolocation API is supported
    if (navigator.geolocation) {
        // Watches the users current location and pass in error handling and success function
        navigator.geolocation.watchPosition(setUserLocationOnMap, handleGeolocationError);
    } else {
        footerAlert("alert-footer", "Attention: Your browser does not support geolocation API, please try another browser!");
    }

}


/**
 * @function setUserLocationOnMap
 * @description Set's users location on the map
 * @param {Array} position 
 */
function setUserLocationOnMap(position) {
    
    // Get Users Location Then Center Maps Focus On Users Location
    userPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
    map.setCenter(userPosition);

    // Set Marker On Location
    new google.maps.Marker({
        position: userPosition,
        icon: "https://ryanmaugin.github.io/assets/CustomMarker.png",
        map: map
    });

    // Show the footer with the destination address
    footerAlert("normal-footer", "Destination: Google UK Ltd. 6 Pancras Square London, N1C 4AG, United Kingdom");

    // Show the Go Button to allow user to start their journey and hide get location button
    document.getElementById("go-btn").classList.remove("hidden");
    document.getElementById("get-loc-btn").classList.add("hidden");
}


/**
 * @function handleGeolocationError
 * @description Handles any errors that can occur when getting users location
 * @param {Dictionary} error 
 */
function handleGeolocationError(error) {

    switch (error.code) {
        // If user denies permission to use their location
        case error.PERMISSION_DENIED:
            footerAlert("error-footer", "Error: Without your permission to use your location we can't direct you to Google :(");
            break;
        // If users position is unavailable due to security features on computer
        case error.POSITION_UNAVAILABLE:
            footerAlert("error-footer", "Error: Your location information seems to be unavailable.");
            break;
        // If request to get users location times out
        case error.TIMEOUT:
            footerAlert("error-footer", "Error: The request to get your location timed out!");
            break;
        // If the error can't be identified
        // This case acts as a 'default' case for the switch statement as any other error will be caught in this case
        case error.UNKNOWN_ERROR:
            footerAlert("error-footer", "Error: Oops! We can't seem to figure what went wrong!");
            break;
    }
}


/**
 * @function footerAlert
 * @description Handles the displaying of messages in the footer
 * @param {String} type The type of message to display in footer e.g. Error, Alert, Normal
 * @param {String} message The message to display in footer
 */
function footerAlert(type, message) {

    // Get footer components from HTML
    footer = document.getElementById('footer');
    footerMsg = document.getElementById('footer-msg');

    // Remove any colour styling classes already on the footer
    footer.classList.remove("normal-footer");
    footer.classList.remove("error-footer");
    footer.classList.remove("alert-footer");

    // Modify Footer Colour and message depending on message type
    footer.classList.add(type);
    footerMsg.innerHTML = message;
}