
// Add this line at the beginning of the file to import 'dataTableInstance'
import { dataTableInstance } from './datatables-simple-demo.js';

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
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
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

    data.forEach(row => {
        const newRow = tableBody.insertRow(-1);

        const deviceIdCell = newRow.insertCell(0);
        deviceIdCell.textContent = row.DeviceID;

        const valueCell = newRow.insertCell(1);
        valueCell.textContent = row.Value;

        const timeCell = newRow.insertCell(2);
        const timestamp = new Date(row.Timestamp);
        timeCell.textContent = timestamp.toLocaleString();
  });
}