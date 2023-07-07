// Define an array of data objects
const data = [
    { id: 1, slopeValue: 2.5, time: "10:00 AM" },
    { id: 2, slopeValue: 3.7, time: "11:30 AM" },
    { id: 3, slopeValue: 1.8, time: "12:45 PM" },
    { id: 3, slopeValue: 1.8, time: "12:45 PM" },
    { id: 3, slopeValue: 1.8, time: "12:45 PM" },
    { id: 3, slopeValue: 1.8, time: "12:45 PM" },
    { id: 3, slopeValue: 1.8, time: "12:45 PM" },
    { id: 3, slopeValue: 1.8, time: "12:45 PM" },
    { id: 3, slopeValue: 1.8, time: "12:45 PM" }
  ];
  
  // Get a reference to the table body
  const tableBody = document.getElementById("table-body");
  
  // Loop through the data and generate a new row for each item
  data.forEach(item => {
    const row = document.createElement("tr");
    
    const idCell = document.createElement("td");
    idCell.textContent = item.id;
    row.appendChild(idCell);
    
    const slopeValueCell = document.createElement("td");
    slopeValueCell.textContent = item.slopeValue;
    row.appendChild(slopeValueCell);
    
    const timeCell = document.createElement("td");
    timeCell.textContent = item.time;
    row.appendChild(timeCell);
    
    tableBody.appendChild(row);
  });
  