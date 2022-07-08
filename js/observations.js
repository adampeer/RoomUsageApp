"use strict";
// Feature 7
// dispMsgAndObsCards() function is used to display the observations that have been saved into the local storage.
// A message will also be displayed showing the amount of observations being shown on screen
// this function utilizes the "content" id found in the observations.html file along with the html codes to dynamically create the observations //cards.
function dispMsgAndObsCards()
{
    let obsRef=document.getElementById("content");
    
    let roomListData = retrieveRoomUsageList();
    
    let obsCard = "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + roomListData._roomList.length + " observation(s) displayed "+ "</td></tr></tbody></table></div>";

    let monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep","Oct","Nov","Dec"];

    // The first part of this for loop checks if the address has a comma or not. If a comma is present, only the address before the comma will be shown on the observations page
    for (let j=((roomListData._roomList.length)-1); j >= 0 ; j-= 1)
    {
        let useBuildingAddress;
        
        let getBuildingAddress = roomListData._roomList[j]._address;
        
        let checkComma = getBuildingAddress.indexOf(",");
        
        if (checkComma !== -1)
        {
            useBuildingAddress = getBuildingAddress.substring(0,checkComma);
            
            roomListData._roomList[j]._address = useBuildingAddress;
        }
        
        obsCard += "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><thead><tr><th class=\"mdl-data-table__cell--non-numeric\"><h4 class=\"date\">";
        
        let date = new Date(roomListData._roomList[j]._timeChecked)
        
        let monthIndex = date.getMonth();
    
        obsCard += date.getDate() + " " + monthList[monthIndex] + "</h4>";
    
        obsCard +=  "<h4>" + roomListData._roomList[j]._address + "<br />" + "Rm " + roomListData._roomList[j]._roomNumber + "</h4></th></tr></thead>" ;
    
        let localTime = date.toLocaleTimeString().toLowerCase();
    
        obsCard += "<tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + "Time: " + localTime +"<br />";
        
        if (roomListData._roomList[j]._lightsOn === false)
        {
            obsCard += "Lights: Off<br />";
        }
    
        else if (roomListData._roomList[j]._lightsOn === true)
        {
            obsCard += "Lights: On<br />";
        
        }
    
        if (roomListData._roomList[j]._heatingCoolingOn === false)
        {
            obsCard += "Heating/cooling: Off<br />";
        }
    
        else if (roomListData._roomList[j]._heatingCoolingOn === true)
        {
            obsCard += "Heating/cooling: On<br />";
        }
    

        obsCard += "Seat usage: " + roomListData._roomList[j]._seatsUsed + "/" + roomListData._roomList[j]._seatsTotal + "<br />" + "<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"deleteObservationAtIndex("+j+");\"><i class=\"material-icons\">delete</i></button></td></tr></tbody></table></div>"
        
        
    }
    obsRef.innerHTML = obsCard;
}
       
dispMsgAndObsCards();

// Feature 8
// This function deletes the observation from both the page and the local storage when the rubbish bin icon is being clicked
// It takes a RoomUsage instance's index as argument and delete the observation according to the index
// This function also checks if the search field is active to allow deletion of observations when in search mode as well
function deleteObservationAtIndex(roomUsageIndex)
{
    let anotherRoomListData = retrieveRoomUsageList();
    
    anotherRoomListData._roomList.splice(roomUsageIndex,1);
    
    storeRoomUsageList(anotherRoomListData);
    
    if (document.getElementById("searchField").value !== "")
    {
        searchObservations();
    }
    
    else
    {
        dispMsgAndObsCards();
    }
    
}

// Feature 9
// This function will search through the _roomList array to find observations that have words or numbers in their address or room number that matches the content typed into the search field
// It will be triggered when the search field is active 
// It also utilizes the html code in the observations.html file to dynamically create observation  cards that matches the content in the search field
function searchObservations()
{
    let searchObsRef = document.getElementById("searchField");
    
    let loadRoomUsageListData = retrieveRoomUsageList();
    
    //let newLoadRoomUsageListData = retrieveRoomUsageList()

    let searchObs = (searchObsRef.value).toLowerCase();

    let searchResult = [];
    // deleteIndex array is used to store index of the observations in the search result in case deletion of observations occur among the search results 
    let deleteIndex = []; 
    
    let extractBuildingAddress,originalBuildingAddress; 
    
    for (let i = 0 ; i < loadRoomUsageListData._roomList.length ; i+=1 )
    {
        let buildingAddress = (loadRoomUsageListData._roomList[i]._address);
        
        let checkComma = buildingAddress.indexOf(",");
        
        if (checkComma !== -1)
        {
            extractBuildingAddress = buildingAddress.substring(0,checkComma).toLowerCase();
            
            originalBuildingAddress = buildingAddress.substring(0,checkComma);
        }
        
        else
        {
            extractBuildingAddress = buildingAddress.toLowerCase();
            
            originalBuildingAddress = buildingAddress;
        }
        
        let room = (loadRoomUsageListData._roomList[i]._roomNumber).toString().toLowerCase();
        
        if ((extractBuildingAddress.indexOf(searchObs) !== -1 ) || (room.indexOf(searchObs) !== -1))
        {
            loadRoomUsageListData._roomList[i]._address = originalBuildingAddress;
            
            searchResult.push(loadRoomUsageListData._roomList[i]);
            
            deleteIndex.push(i);
           
        }

    }
   
    let obsRef = document.getElementById("content");
    
    if (searchResult.length === 0 )
    {
        
        let noSearchFound = "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + "No observation(s) found "+ "</td></tr></tbody></table></div>";
        
        obsRef.innerHTML = noSearchFound;
    }
    
    else
    {
        let searchObsHTML;
        
        if (searchObsRef.value === "")
        {
            searchObsHTML = "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + loadRoomUsageListData._roomList.length + " observation(s) displayed" +  "</td></tr></tbody></table></div>"; 
        }
        else
        {
            searchObsHTML = "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + searchResult.length + " observation(s) displayed for " + searchObsRef.value +  "</td></tr></tbody></table></div>"; 
        }
        
        let monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep","Oct","Nov","Dec"];
        
        for (let j=((searchResult.length)-1); j >= 0 ; j-= 1)
        {
            searchObsHTML += "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><thead><tr><th class=\"mdl-data-table__cell--non-numeric\"><h4 class=\"date\">";
            
            let date = new Date(searchResult[j]._timeChecked)
       
            let monthIndex = date.getMonth();
    
            searchObsHTML += date.getDate() + " " + monthList[monthIndex] + "</h4>";
    
            searchObsHTML +=  "<h4>" + searchResult[j]._address + "<br />" + "Rm " + searchResult[j]._roomNumber + "</h4></th></tr></thead>" ;
    
            let localTime = date.toLocaleTimeString().toLowerCase();
    
            searchObsHTML += "<tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + "Time: " + localTime +"<br />";
        
            if (searchResult[j]._lightsOn === false)
            {
                searchObsHTML += "Lights: Off<br />";
            }
    
            else if (searchResult[j]._lightsOn === true)
            {
                searchObsHTML += "Lights: On<br />";
        
            }
    
            if (searchResult[j]._heatingCoolingOn === false)
            {
                searchObsHTML += "Heating/cooling: Off<br />";
            }
    
            else if (searchResult[j]._heatingCoolingOn === true)
            {
                searchObsHTML += "Heating/cooling: On<br />";
            }
    

            searchObsHTML += "Seat usage: " + searchResult[j]._seatsUsed + "/" + searchResult[j]._seatsTotal + "<br />" + "<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"deleteObservationAtIndex("+deleteIndex[j]+");\"><i class=\"material-icons\">delete</i></button></td></tr></tbody></table></div>"

        }
        obsRef.innerHTML = searchObsHTML;
    }
     
}
    
   
