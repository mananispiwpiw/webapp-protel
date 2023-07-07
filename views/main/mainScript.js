//Fetch API
//Define the url we want to fetch from
const apiUrl = 'http://localhost:3000/api/post/sensor'

//Define the function that fetches the data
async function getSensorData(){
  try{ 
    // Make GET request to API endpoint
    const response = await fetch(apiUrl);

    //check if the request was successful (status code 200)
    if (!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    //Parse the JSON data from the response
    const data = await response.json();

    //Use the sensor data (e.g. display it)
    console.log('Sensor data: ',data);
  } catch (error){
    console.log('Error fetching data',error);
  }
}

//Call the function
getSensorData();

// CHARTS
var lineChartOptions = {
    chart: {
      type: 'line',
      height: 250
    },
    series: [{
      name: 'Data',
      data: [28, 29, 33, 36, 32, 32, 33]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    }
  }
  
  var lineChart = new ApexCharts(document.querySelector("#line-chart"), lineChartOptions);
  lineChart.render();
  // CONTENT
  const dashboardLink = document.getElementById("dashboard-link");
  dashboardLink.addEventListener("click", (event) => {
    event.preventDefault();
    content.innerHTML = `
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard</p>
    `;
  });