"use strict";
// Feature 12
// getAddressKey returns the address of the RoomUsage instance to the aggregateBy method method
// It also takes in a RoomUsage instance as argument
function getAddressKey(roomUsageInstance)
{
    let key = roomUsageInstance._address;
    
    return key;
}

let searchAddressKey = getAddressKey;

let roomListData = retrieveRoomUsageList();

let buildingStats;

for (let i = 0 ; i < roomListData._roomList.length ; i += 1)
{
    buildingStats = roomListData.aggregateBy(searchAddressKey);
}

let numOfObs;

let averageSeats,averageLights,averageHeatingCooling;

for (let buildings in buildingStats)
{
    numOfObs = buildingStats[buildings]._roomList.length;
    
    // Storing the number of observations related to one particular building in the buildingStats object
    buildingStats[buildings]["numOfObs"] = numOfObs ;
    
    let checkLights  ;
    
    let checkHeatingCooling  ;
    
    let wastefulObs = 0;
    
    let allSeatsUsed = 0;
    
    let allSeatsTotal = 0;
    
    let allLightsCheck = 0;
    
    let allHeatingCoolingCheck = 0;
    
    // The following for loop checks if the lights or heating/cooling are on when the are no seats occupied in the room to find out wasteful observations
    for (let a = 0 ; a < buildingStats[buildings]._roomList.length ; a+=1)
    {
        let seats = 0 ;
        
        seats += buildingStats[buildings]._roomList[a]._seatsUsed;
        
        checkLights = buildingStats[buildings]._roomList[a]._lightsOn;
        
        checkHeatingCooling = buildingStats[buildings]._roomList[a]._heatingCoolingOn;
        
        if (((seats === 0) && (checkLights === true)) || ((seats === 0) && (checkHeatingCooling === true)))
        {
            wastefulObs += 1;
        }
        
        allSeatsUsed += buildingStats[buildings]._roomList[a]._seatsUsed;
        
        allSeatsTotal += buildingStats[buildings]._roomList[a]._seatsTotal; 
        
        if (buildingStats[buildings]._roomList[a]._lightsOn === true)
        {
            allLightsCheck += 1;
        }
        
        if (buildingStats[buildings]._roomList[a]._heatingCoolingOn === true)
        {
            allHeatingCoolingCheck += 1;
        }
        
    }
    averageSeats = (((allSeatsUsed / allSeatsTotal)) * 100).toFixed(1);
    
    averageLights = (((allLightsCheck) / (numOfObs)) * 100).toFixed(1);
    
    averageHeatingCooling = (((allHeatingCoolingCheck) / (numOfObs)) *100).toFixed(1);
    
    // All the infos that are going to be displayed in the buildingStats page will be added to the buildingStats object for ease of access later on
    buildingStats[buildings]["wastefulObs"] = wastefulObs;
    
    buildingStats[buildings]["allSeatsUsed"] = allSeatsUsed;
    
    buildingStats[buildings]["allSeatsTotal"]= allSeatsTotal;
    
    buildingStats[buildings]["averageSeats"] = averageSeats;
    
    buildingStats[buildings]["averageLights"] = averageLights;
    
    buildingStats[buildings]["averageHeatingCooling"] = averageHeatingCooling;
    
}

let buildingStatsDisplayRef = document.getElementById("content");

let buildingStatsCard = "";

// checkBuildignStatsEmpty is used to store a stringified buildingStats object in order to check if the buildingStats object is empty
let checkBuildingStatsEmpty = JSON.stringify(buildingStats);

// If checkBuildingStatsEmpty gives undefined, this means buildingStats object is empty and a message will be shown on the buildingStats page instead of the actual building stats data
if (checkBuildingStatsEmpty === undefined)
{
    buildingStatsCard += "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + "No building stats is available to be displayed at the moment" + "</td></tr></tbody></table></div>";
}

else
{
    for (let displayStats in buildingStats)
    {
        let extractAddress; 
    
        for (let b = 0 ; b < buildingStats[displayStats]._roomList.length ; b += 1)
        {
            let checkComma = buildingStats[displayStats]._roomList[b]._address.indexOf(",");
        
            if (checkComma !== -1)
            {
                extractAddress = buildingStats[displayStats]._roomList[b]._address.substring(0,checkComma);

            }
        
            else
            {
                extractAddress = buildingStats[displayStats]._roomList[b].address;
            }
        
        }
        
        // Feature 13
        // This checks if the wastefulObs property has a value of more than one
        // If the value is more than one then the building stats for the particular building will be highlighted with another colour
        if (buildingStats[displayStats]["wastefulObs"] >= 1)
        {
            buildingStatsCard += "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><thead><tr><th class=\"mdl-data-table__cell--non-numeric\"id =\"changeColour\"><h4>";
        }
    
        else
        {
            buildingStatsCard += "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><thead><tr><th class=\"mdl-data-table__cell--non-numeric\"><h4>";
        }
    
        buildingStatsCard += extractAddress + "</h4></th></tr></thead><tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + "Observations: " + buildingStats[displayStats]["numOfObs"] + "<br />" + "Wasteful observations: " + buildingStats[displayStats]["wastefulObs"] + "<br />" + "Average seat utilisation: " + buildingStats[displayStats]["averageSeats"] + "%" + "<br />" + "Average lights utilisation: " + buildingStats[displayStats]["averageLights"] + "%" + "<br />" + "Average heating/cooling utilisation: " + buildingStats[displayStats]["averageHeatingCooling"] + "%" + "</td></tr></tbody></table></div>";
    }
}


buildingStatsDisplayRef.innerHTML = buildingStatsCard;
