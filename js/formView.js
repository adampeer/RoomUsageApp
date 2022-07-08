"use strict";

// Feature 3: New Room Observation

// The saveFunction function is used to save the data that has been inputted. The getElementById() method returns the element that has 
// the ID attribute with the specified value. This method is one of the most common methods in the HTML DOM, and is used almost every
// time you want to manipulate, or get info from, an element on your document. Conditions are checked to make the correct data and data
// types are being inputted. Specific error messages are shown when specific errors are encountered, using the displayMessage function.
// The function is activated by using the SAVE button.

function saveFunction()
{
    let addressRef, useAddressRef, roomNumberRef, lightsRef, heatingCoolingRef, seatsUsedRef, seatsTotalRef;
    
    let address, useAddress, roomNumber, lights, heatingCooling, seatsUsed, seatsTotal;
    
    addressRef = document.getElementById("address");
    
    address = addressRef.value;
    
    useAddressRef = document.getElementById("useAddress");
        
    roomNumberRef = document.getElementById("roomNumber");
    
    roomNumber = roomNumberRef.value;
    
    lightsRef = document.getElementById("lights");
    
    // The "checked" keyword is used to literally check if the slider is On or Off.
    
    if (lightsRef.checked === true)
        {
            lights = true;
        }
    else
        {
            lights = false;
        }
    
    heatingCoolingRef = document.getElementById("heatingCooling");
    
    // Checking if heating / cooling is On or Off
    
    if (heatingCoolingRef.checked === true)
        {
            heatingCooling = true;
        }
    else
        {
            heatingCooling = false;
        }
    
    seatsUsedRef = document.getElementById("seatsUsed");
    
    seatsUsed = seatsUsedRef.value;
    
    seatsTotalRef = document.getElementById("seatsTotal");
    
    seatsTotal = seatsTotalRef.value;
    
    let timeChecked = new Date();
    
    //Checking for blank fields and any errors
    
    if (address == "" || roomNumber == "" || seatsUsed == "" || seatsTotal == "")
        {
            displayMessage('Please fill in all the fields');
        }
    else if (seatsUsed < 0)
        {
            displayMessage('Number of seats used cannot be less than zero')
        }
    else if (seatsTotal < 0)
        {
            displayMessage('Number of seats available cannot be less than zero');
        }
    else if (isNaN(seatsUsed) === true || isNaN(seatsTotal) === true)
        {
            displayMessage('Please make sure the entered data are of the correct type');
        }
    else if (Number(seatsUsed) > Number(seatsTotal))
        {
            displayMessage('Number of seats in use cannot be greater than total number of seats available');
        }
    else
        {          
            // Retrieve the _roomList from local storage
            let roomUsageListInstance = retrieveRoomUsageList();

            roomUsageListInstance.getObservation(roomNumber, address, lights, heatingCooling, Number(seatsUsed), Number(seatsTotal),timeChecked);
            
            // storeRoomUsageList function is used to save the RoomUsageList instance to localStorage
            storeRoomUsageList(roomUsageListInstance);

            
            // Clearing all fields after saving the data
            justClear();
            
            displayMessage('Observation has been saved');
        }    
}

// clearFunction function is just the justClear function but with a message. The function is activated by using the CLEAR button.

function clearFunction()
{
    justClear();
    
    displayMessage('All data has been cleared');
}

// justCLear function is used to clear the text fields by filling the fields with basically nothing or null.

function justClear()
{
    let addressRef, useAddressRef, roomNumberRef, lightsRef, heatingCoolingRef, seatsUsedRef, seatsTotalRef;
    
    let address, useAddress, roomNumber, lights, heatingCooling, seatsUsed, seatsTotal;
    
    addressRef = document.getElementById("address");
    
    addressRef.value = "";
    
    address = addressRef.value;
    
    addressRef.parentNode.MaterialTextfield.checkDirty();

    roomNumberRef = document.getElementById("roomNumber");
    
    roomNumberRef.value = "";
    
    roomNumber = roomNumberRef.value;
    
    roomNumberRef.parentNode.MaterialTextfield.checkDirty();
    
    seatsUsedRef = document.getElementById("seatsUsed");
        
    seatsUsedRef.value = "";
    
    seatsUsed = seatsUsedRef.value;
    
    seatsUsedRef.parentNode.MaterialTextfield.checkDirty();

    seatsTotalRef = document.getElementById("seatsTotal");
    
    seatsTotal = seatsTotalRef.value;
    
    seatsTotalRef.value = "";
    
    seatsTotal = addressRef.value;
    
    seatsTotalRef.parentNode.MaterialTextfield.checkDirty();

}

// Feature 4

// The determineAddress function is used to get the coordinates of the user and then uses the OpenCage Geocoder reverse geocoding API to 
// get the location of the user. The function is activated by clicking on the checkbox next to "Automatically determine my address".

function determineAddress(useAddressRef)
{
    //Getting latitude and longitude
    
    if (useAddressRef.checked === true)
        {
            //Following code has been found at https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/longitude
            
            navigator.geolocation.watchPosition(function(position) {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                let accuracy = position.coords.accuracy;
                
                
                
                if (accuracy < 3000)
                    {
                        // latlong variable is used to concatenate the latitude and the longitude in order to use them in the API url

                        let latlong = lat + "," + long;

                        let apiKey = '0e00c30c515447ddaf31ad45cc40f17f';

                        let url = "https://api.opencagedata.com/geocode/v1/json?q=" + latlong + "&key=0e00c30c515447ddaf31ad45cc40f17f&jsonp=coordinatesResponse"

                        // Creating a script object

                        let script = document.createElement('script');
                        script.src = url;
                        document.body.appendChild(script); 
                    }
                
                if (useAddressRef.checked === false)
                    {
                        navigator.geolocation.clearWatch(position);
                    }
                
            }   //Curly brackets for funtion position
        )   //Paranthesis for getCurentPostion
    }    //Curly bracket for if statement
} //Curly brackets for funtion determineAddress

// The coordinatesResponse function is the callback function used in the API url. 
                                                     
function coordinatesResponse(coordinatesArray)
{
    let addressRef = document.getElementById("address");
    
    let address = "";
    
    addressRef.value = coordinatesArray.results[0].formatted;  
    
    address = addressRef.value;
    
    addressRef.innerHTML = address;
}

// Using Enter key to submit form. Using it for convenience. Might delete later. Also, not sure but it might work on virtual enter key
// also.

document.onkeydown = function(evt) 
{
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
    if(keyCode == 13)
    {
        saveFunction();
    }
}