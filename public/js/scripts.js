//Function for status card
function updateStatusCard(latestValue) {
    const statusCard = document.querySelector('#statusCard');
    const statusCardBody = document.querySelector('#statusCardBody');
    if (statusCardBody){ //Add a check to make sure the element exists
        if (latestValue <= 2) {
            statusCardBody.textContent = 'SAFE';
            statusCard.style.setProperty('--bs-bg-opacity', '1');
            statusCard.style.backgroundColor = 'rgba(0, 128, 0, var(--bs-bg-opacity))';
        } else if (latestValue >2 && latestValue <= 4) {
            statusCardBody.textContent = 'WARNING!';
            statusCard.style.setProperty('--bs-bg-opacity', '1');
            statusCard.style.backgroundColor = 'rgba(255, 165, 0, var(--bs-bg-opacity))';
        } else {
            statusCardBody.textContent = 'DANGER!!';
            statusCard.style.setProperty('--bs-bg-opacity', '1');
            statusCard.style.backgroundColor = 'rgba(255, 0, 0, var(--bs-bg-opacity))';
        }
    }
  }

function fetchWithTimeout(url, options, timeout = 3000) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
    ]);
  }

function fetchAndUpdateTableData() {
    //logging
    console.log("Fetching data from API...");

    fetch('http://127.0.0.1:3000/api/get/sensor')
        .then(response => response.json())
        .then(response => {
            //logging
            console.log("API response:", response);

            if (response.status === "success") {
                const data = response.data; // Wrap the data in an array to use it with updateTable()
                
                // Call the new function to update the table
                updateTable(data);
                updateStatusCard(data[0].Value); // Add this line to update the status card
                //Check the value of the latest data is greater than 12
                const latestValue = data[0].Value;
                const hasDangerousValue = latestValue > 4;
                if (hasDangerousValue) {
                    // Show a notification
                    if (Notification.permission === 'granted') {
                        const notification = new Notification('DANGER!!', {
                            body: 'A shift outside the normal state.',
                            icon: 'https://example.com/images/notification-icon.png'
                        });
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                const notification = new Notification('DANGER!!', {
                                    body: 'A shift outside the normal state.',
                                    icon: 'https://example.com/images/notification-icon.png'
                                });
                            }
                        });
                    }
                }
            }else{
            console.error(response.message);
        }
        })
        .catch(error => {
            console.error(error);
        });
}

window.addEventListener('DOMContentLoaded', event => {
    console.log("DOMContentLoaded event triggered."); 
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
    
    fetchAndUpdateTableData();
    setInterval(fetchAndUpdateTableData, 3000);
  
});

function updateTable(data){
    const tableBody = document.querySelector('#streamingDataTable tbody');
    tableBody.innerHTML = '';


  let tableData = data;

  if (window.location.pathname === "/models/fulldataraw.html") { //If the user is on the fulldataraw.html page, display all the data
    const urlParams = new URLSearchParams(window.location.search);
    const deviceID = urlParams.get("deviceID");
    console.log("deviceID:", deviceID);
    tableData = data.filter(row => row.DeviceID === deviceID).reverse();
    console.log("filtered tableData:", tableData);
  } else { //Otherwise, display only the latest 20 rows of data
    tableData = data.slice(0,20).reverse();
  }
    // // Sort the data array by timestamp in descending order
    // const sortedData = data.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

    // const latestData = sortedData.slice(0,20).reverse(); //Get the last 20 rows of data

    tableData.forEach(row => {

        const newRow = tableBody.insertRow(0);
         

        const deviceIdCell = newRow.insertCell(0);
        deviceIdCell.textContent = row.DeviceID;

        const valueCell = newRow.insertCell(1);
        valueCell.textContent = row.Value;

        const timeCell = newRow.insertCell(2);
        const timestamp = new Date(row.Timestamp);
        timeCell.textContent = timestamp.toLocaleString();

        // Hover logic for the table rows
        if (window.location.pathname !== "/models/fulldataraw.html") {
            newRow.addEventListener("mouseover", () => {
              newRow.style.backgroundColor = "lightgray";
              newRow.style.cursor = "pointer";
            });
          
            newRow.addEventListener("mouseout", () => {
              newRow.style.backgroundColor = "";
              newRow.style.cursor = "";
            });
          
            newRow.addEventListener("click", () => {
              const urlParams = new URLSearchParams();
              urlParams.append("deviceID", row.DeviceID);
              window.location.href =
                "./models/fulldataraw.html?" + urlParams.toString();
            });
        }
    });
}
    