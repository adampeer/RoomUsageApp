"use strict";

// Feature 1: RoomUsage class

class RoomUsage
    {
        constructor(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal, timeChecked)
        {
            //Private attributes
            
            //Room Number
            this._roomNumber = roomNumber;
            
            //Building address
            this._address = address;
            
            //Lights on
            this._lightsOn = lightsOn;
            
            //Air Conditioning/ Heating on 
            this._heatingCoolingOn = heatingCoolingOn;
            
            //Number of seats in use
            this._seatsUsed = seatsUsed;
            
            //Total number of seats in room
            this._seatsTotal = seatsTotal;
            
            //Date/time usage checked
            this._timeChecked = timeChecked;
        }
        
        //Public methods
        
		set roomNumber(newRoomNumber)
            {
                if ((newRoomNumber !== null) && (typeof(newRoomNumber) === 'string'))
                {
                    this._roomNumber = newRoomNumber;
                }
            }
        
		set address(newAddress)
            {
                if (typeof(newAddress) === 'string' && newAddress !== null )
                {
                    this._address = newAddress;
                }
            }
        
       
		set lightsOn(newLightsOn)
            {
                if ((typeof(newLightsOn) === 'boolean') && (newLightsOn == true || newLightsOn == false))
                {
                    this._lightsOn = newLightsOn;
                }
            }
        
		set heatingCoolingOn(newHeatingCoolingOn)
            {
                if ((typeof(newHeatingCoolingOn) === 'boolean') & (newHeatingCoolingOn == true || newHeatingCoolingOn== false))
                {
                    this._heatingCoolingOn = newHeatingCoolingOn;
                } 
            }
        
        
		set seatsUsed(newSeatsUsed)
            {
                if ((newSeatsUsed > 0 ) && (newSeatsUsed < seatsTotal) && (Number.isInteger(newSeatsUsed)=== true) && (typeof (newSeatsUsed) === 'number'))
                {
                    this._seatsUsed = newSeatsUsed;
                }
            }
        
		set seatsTotal(newSeatsTotal)
            {
                if ( (newSeatsTotal > 0) && (Number.isInteger(newSeatsTotal) === true)  && (typeof(newSeatsTotal) === 'number'))
                {
                    this._seatsTotal = newSeatsTotal;
                }
            }
        
		set timeChecked(newTimeChecked)
            {
                newTimeChecked = new Date ();
                this._timeChecked = newTimeChecked;
            }
        
        // Reinitialises this instance from a public-data room object.
        
        initialiseFromRoomUsagePDO(roomObject)
        {
            // Initialise the instance via the mutator methods from the PDO object.
            
            this._roomNumber = roomObject._roomNumber;
            
            this._address = roomObject._address;
            
            this._lightsOn = roomObject._lightsOn;
            
            this._heatingCoolingOn = roomObject._heatingCoolingOn;
            
            this._seatsUsed = roomObject._seatsUsed;
            
            this._seatsTotal = roomObject._seatsTotal;
            
            this._timeChecked = roomObject._timeChecked;
        }
        
        get roomNumber()
			{
				return this._roomNumber;
			}
        
        get address()
			{
				return this._address;
			}
        
         get lightsOn()
			{
				return this._lightsOn;
			}
        
        get heatingCoolingOn()
			{
				return this._heatingCoolingOn;
			}
        
        get heatingCoolingOn()
			{
				return this._heatingCoolingOn;
			}
        
        get seatsTotal()
			{
				return this._seatsTotal;
			}
        
        get timeChecked()
			{
				return this._timeChecked;
			}
        
    }

// Feature 2: RoomUsageList class

class RoomUsageList
    {               
        constructor()
        {
            // Private attibutes
            
            // roomList
            
            this._roomList = [];
        }
        
        //Public Methods
        
        initialiseFromRoomUsageListPDO(roomUsageListPDO)
        {
            this._roomList = [];

            if (roomUsageListPDO === null)
            {
                let roomUsageListInstance = new RoomUsageList();
                
                return roomUsageListInstance;
            }
            else
            {
                for (let i = 0; i < roomUsageListPDO._roomList.length; i++)
                {
                    let roomUsage = new RoomUsage();
                    
                    roomUsage.initialiseFromRoomUsagePDO(roomUsageListPDO._roomList[i]);
                    
                    this._roomList.push(roomUsage);
                }
            }
        }   
                
        get roomList()
        {
            return this._roomList;
        }
        
        getObservation(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal, timeChecked)
        {
            this._roomList.push(new RoomUsage(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal, timeChecked));
        }
        
        // aggregateBy method takes a first class function as its argument and sort the RoomUsageList instance into different buckets
        aggregateBy(returnKeyFunction)
        {
            let allRoomUsageListData = retrieveRoomUsageList();
            
            let copyOfAllRoomUsageListData = retrieveRoomUsageList();
            
            for (let a = 0 ; a < allRoomUsageListData._roomList.length ; a += 1)
            {
                let changeTime = new Date(allRoomUsageListData._roomList[a]._timeChecked);
                
                let getChangedTimeInHour = changeTime.getHours();
                
                allRoomUsageListData._roomList[a]._timeChecked = getChangedTimeInHour;
            }
            
            let bucketObject = {};
            
            for (let i = 0 ; i < allRoomUsageListData._roomList.length ; i += 1)
            {
                let returnedKey = returnKeyFunction(allRoomUsageListData._roomList[i]);
                
                if (((returnedKey >= 8) && (returnedKey <= 18)) || (typeof(returnedKey) === "string"))
                {

                    if ( bucketObject.hasOwnProperty(returnedKey) === false)
                    {
                        let addNewRoomUsageList = new RoomUsageList();
                        
                        bucketObject[returnedKey] = addNewRoomUsageList;

                        bucketObject[returnedKey]._roomList.push(copyOfAllRoomUsageListData._roomList[i]);

                    }
                    else 
                    {
                        bucketObject[returnedKey]._roomList.push(copyOfAllRoomUsageListData._roomList[i]);
                    }
                }
                
                
            }
            
            return bucketObject;
            
        }
        
    }

//===========================================================

// Feature 5: Storing RoomUsageList data in localStorage

// Key created to store and retrieve data

const STORAGE_KEY = "ENG1003-RoomUseList";  

// Creating a new RoomUsageList class to save all the RoomUsage classes

//let roomUsageListInstance = new RoomUsageList();

// storeRoomUsageList function is used to store data to localStorage

function storeRoomUsageList(roomUsageListInstance)
{
    if( typeof(Storage) !== "undefined")
    {
        // Stringify roomUsageListInstance to a JSON string
        
        let roomUsageListInstanceAsJSON = JSON.stringify(roomUsageListInstance);
        
        // Store this JSON string to local storage using the key STORAGE_KEY.

        localStorage.setItem(STORAGE_KEY,roomUsageListInstanceAsJSON);
    }
    else 
    {
        displayMessage("Local storage not supported by current browser")

    }
    
}

// Feature 6: Loading RoomUsage data from localStorage

// retieveRoomUsageList function is used to retrieve data from localStorage

function retrieveRoomUsageList()
{
    if (typeof(Storage) !== "undefined")
        {
            // Retrieve the stored JSON string and parse to a variable called deckObject.
            // Use this to initialise an new instance of the RoomUsageList class.
            let roomUsageListJSON = localStorage.getItem(STORAGE_KEY);
            
            let publicDataRoomUsageListObject = JSON.parse(roomUsageListJSON);
            
            let roomUsageListInstance = new RoomUsageList(); 
            
            roomUsageListInstance.initialiseFromRoomUsageListPDO(publicDataRoomUsageListObject);
            
            return roomUsageListInstance;
            
        }
    else
        {
            displayMessage("Error: localStorage is not supported by current browser.");
        }
}