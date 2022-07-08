"use strict";
// Feature 11
// getHoursKey function returns the hour of each RoomUsage instance to the aggregateBy method
// This feature is used to display the 5 worst occupancy of each hour from 8 am to 6 pm
// The object returned by the aggregateBy method is sorted in ascending order to find the top 5 worst occupancies at each hour
// The occupancy data is displayed using the html codes available in occupancy.html file.
function getHoursKey(roomUsageInstance)
{
    let key = roomUsageInstance._timeChecked;
    
    return key;
}

// Assign the getHoursKey function to a variable so that it can be passed to the aggregateBy method
let searchHrKeyFunction = getHoursKey;

// Retrieve the RoomUsageList instance from local storage
let roomListData = retrieveRoomUsageList();

let bucketWithOccupancy;

for (let k = 0 ; k< roomListData._roomList.length ; k += 1)
{
    
    bucketWithOccupancy = roomListData.aggregateBy(searchHrKeyFunction);
    
}

let hourRecord = [];

for (let allHours in bucketWithOccupancy)
{
    hourRecord.push(bucketWithOccupancy[allHours])
}

for (let hours in bucketWithOccupancy)
{
    let seatUsed,seatTotal,occupancy;
    
    let occupancyArray = [];

    for (let i = 0 ; i < bucketWithOccupancy[hours]._roomList.length ; i+=1 )
    {
        seatUsed = bucketWithOccupancy[hours]._roomList[i]._seatsUsed;
        
        seatTotal = bucketWithOccupancy[hours]._roomList[i]._seatsTotal;
        
        occupancy = ((seatUsed/seatTotal)*100).toFixed(1);
        
        // Converts NaN to 0.0 when the occupancy has a value of NaN
        if (occupancy === NaN.toString())
        {
            occupancy = "0.0";
        }
        
        bucketWithOccupancy[hours]._roomList[i]["totalOccupancy"] = Number(occupancy);
        
    }
    
}

for (let diffTimes in bucketWithOccupancy)
{
    bucketWithOccupancy[diffTimes]._roomList.sort(function (a,b){return a["totalOccupancy"] - b["totalOccupancy"]})
}

let occupancyRef = document.getElementById("content");

let occupancyCard = "";

// checkBucketWithOccupancyEmpty is used to store the stringified version of the bucketWithOccupancy object in order to determine if there are no occupancy to be displayed in the occupancy page
let checkBucketWithOccupancyEmpty = JSON.stringify(bucketWithOccupancy);

// If checkBucketWithOccupancyEmpty has a value of undefined then a message will be shown on the occupancy page instead of the actual occupancies of each hour from 8 am to 6pm
if (checkBucketWithOccupancyEmpty === undefined)
{
    occupancyCard += "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><tbody><tr><td class=\"mdl-data-table__cell--non-numeric\">" + "No occupancy is available to be displayed at the moment" + "</td></tr></tbody></table></div>";
}

else
{
    for (let displayHr in bucketWithOccupancy)
    {

        let timeIn12HrFormat;
    
        if (Number(displayHr) > 12 )
        {
            timeIn12HrFormat = (Number(displayHr) - 12).toString() + " pm" ;
        }
    
        else if (displayHr === "12")
        {
            timeIn12HrFormat = displayHr + " pm";
        }
    
        else
        {
            timeIn12HrFormat = displayHr + " am";
        }
        
        
        occupancyCard += "<div class=\"mdl-cell mdl-cell--4-col\"><table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\"><thead><tr><th class=\"mdl-data-table__cell--non-numeric\"><h5>" + "Worst occupancy for " +  timeIn12HrFormat + "</h5></th></tr></thead><tbody>";
    
        if (bucketWithOccupancy[displayHr]._roomList.length > 5)
        {
            for ( let j = 0 ; j < 5 ; j+=1)
            {
                
                let heatingCooling, lightsOffOn,displayTime, day, month, year, toLocalTime,toLocaltTimeWithoutPmAm,extractAddress; ;
            
                if (bucketWithOccupancy[displayHr]._roomList[j]._heatingCoolingOn === true)
                {
                    heatingCooling = "Heating/cooling: On";
                }
                else 
                {
                    heatingCooling = "Heating/cooling: Off";
                }
            
                if (bucketWithOccupancy[displayHr]._roomList[j]._lightsOn === true)
                {
                    lightsOffOn = "Lights: On";
                }
                else 
                {
                    lightsOffOn = "Lights: Off";
                }
            
                displayTime = new Date(bucketWithOccupancy[displayHr]._roomList[j]._timeChecked);
            
                day = displayTime.getDate();
            
                month = displayTime.getMonth();
            
                year = displayTime.getFullYear();
            
                toLocalTime = displayTime.toLocaleTimeString();
            
                toLocaltTimeWithoutPmAm = toLocalTime.substring(0, (toLocalTime.length)-2);
  
                let checkComma = bucketWithOccupancy[displayHr]._roomList[j]._address.indexOf(",");
        
                if (checkComma !== -1)
                {
                    extractAddress = bucketWithOccupancy[displayHr]._roomList[j]._address.substring(0,checkComma);

                }
        
                else
                {
                    extractAddress = bucketWithOccupancy[displayHr]._roomList[j].address;
                }
        
            
            
                occupancyCard += "<tr><td class=\"mdl-data-table__cell--non-numeric\"><div><b>" + extractAddress+ "; Rm " + bucketWithOccupancy[displayHr]._roomList[j]._roomNumber + "</b></div><div>" + "Occupancy: " + bucketWithOccupancy[displayHr]._roomList[j]["totalOccupancy"] + "%</div><div>" + heatingCooling + "</div><div>" + lightsOffOn + "</div><div><font color=\"grey\"><i>" + day + "/"  + month + "/" + year + ", " + toLocaltTimeWithoutPmAm + "</i></font></div></td></tr>";
            
                if( j === 4)
                {
                    occupancyCard +="</tbody></table></div>";
                }
            
            }
        }
        else
        {
            for (let k = 0 ; k < bucketWithOccupancy[displayHr]._roomList.length ; k+=1)
            {
                let heatingCooling, lightsOffOn,displayTime, day, month, year, toLocalTime, toLocaltTimeWithoutPmAm,extractAddress;
            
                if (bucketWithOccupancy[displayHr]._roomList[k]._heatingCoolingOn === true)
                {
                    heatingCooling = "Heating/cooling: On";
                }
                else 
                {
                    heatingCooling = "Heating/cooling: Off";
                }
            
                if (bucketWithOccupancy[displayHr]._roomList[k]._lightsOn === true)
                {
                    lightsOffOn = "Lights: On";
                }
                else 
                {
                    lightsOffOn = "Lights: Off";
                }
            
                displayTime = new Date(bucketWithOccupancy[displayHr]._roomList[k]._timeChecked);
            
                day = displayTime.getDate();
            
                month = Number(displayTime.getMonth()) + 1;
            
                year = displayTime.getFullYear();
            
                toLocalTime = displayTime.toLocaleTimeString();
            
                toLocaltTimeWithoutPmAm = toLocalTime.substring(0, (toLocalTime.length)-2);
            
                let checkComma = bucketWithOccupancy[displayHr]._roomList[k]._address.indexOf(",");
        
                if (checkComma !== -1)
                {
                    extractAddress = bucketWithOccupancy[displayHr]._roomList[k]._address.substring(0,checkComma);

                }
        
                else
                {
                    extractAddress = bucketWithOccupancy[displayHr]._roomList[k].address;
                }
                
                occupancyCard += "<tr><td class=\"mdl-data-table__cell--non-numeric\"><div><b>" + extractAddress + "; Rm " + bucketWithOccupancy[displayHr]._roomList[k]._roomNumber + "</b></div><div>" + "Occupancy: " + bucketWithOccupancy[displayHr]._roomList[k]["totalOccupancy"] + "%</div><div>" + heatingCooling + "</div><div>" + lightsOffOn + "</div><div><font color=\"grey\"><i>" + day + "/"  + month + "/" + year + "," + toLocaltTimeWithoutPmAm + "</i></font></div></td></tr>"
            
                if(k === (bucketWithOccupancy[displayHr]._roomList.length) - 1)
                {
                    occupancyCard += "</tbody></table></div>";
                }
            }
        }
    }
}


occupancyRef.innerHTML = occupancyCard;


