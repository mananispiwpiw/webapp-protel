const MAX_DATA_POINTS = 10; // Change this to your desired maximum number of data points

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Create an empty line chart
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Live Data",
            lineTension: 0.3,
            backgroundColor: "rgba(2,117,216,0.2)",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: []
        }],
    },
    options: {
        scales: {
            xAxes: [{
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 10 // Change this to your desired Y-axis maximum value
                },
                gridLines: {
                    color: "rgba(0, 0, 0, .125)",
                }
            }],
        },
        legend: {
            display: false
        }
    }
});

// Create an empty line chart
var ptx = document.getElementById("myAreaChartP");
var myLineChartP = new Chart(ptx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Live Data",
            lineTension: 0.3,
            backgroundColor: "rgba(41,37,37,0.2)",
            borderColor: "rgba(41,37,37,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(41,37,37,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: []
        }],
    },
    options: {
        scales: {
            xAxes: [{
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 10 // Change this to your desired Y-axis maximum value
                },
                gridLines: {
                    color: "rgba(0, 0, 0, .125)",
                }
            }],
        },
        legend: {
            display: false
        }
    }
});



function updateChart(data) {
    try {
      // Parse the timestamps using moment.js and sort the data by timestamp (newest to oldest)
      data = data.map(d => ({...d, Timestamp: moment(d.Timestamp)})).sort((a, b) => b.Timestamp.diff(a.Timestamp));
  
      // Extract x and y values from the fetched data
      const timestamps = data.map(d => moment(d.Timestamp));
      const values = data.map(d => d.Value);
  
      // Ensure we only show the 20 newest data points
      const newestTimestamps = timestamps.slice(0, 20);
      const newestValues = values.slice(0, 20);
  
      // Format the timestamps
      const formattedTimestamps = newestTimestamps.map(t => t.format('HH:mm:ss'));
  
      // Remove old data points from the chart
      myLineChart.data.labels = formattedTimestamps;
      myLineChart.data.datasets[0].data = newestValues;
  
      // Update the chart
      myLineChart.update();
    } catch(error) {
      console.error('Error updating chart:', error);
    }
}

function updateChartP(dataP) {
    console.log('Raw Data:', dataP);
    try {
      if (dataP && Array.isArray(dataP)) { // Modified line
        // Parse the timestamps using moment.js and sort the data by timestamp (newest to oldest)
        const data = dataP.map(d => ({...d, Timestamp: moment(d.Timestamp)})).sort((a, b) => b.Timestamp.diff(a.Timestamp));
        console.log('Parsed Data:', data);
  
        // Extract x and y values from the fetched data
        const timestamps = data.map(d => d.Timestamp);
        const values = data.map(d => d.PValue);
  
        // Ensure we only show the 20 newest data points
        const newestTimestamps = timestamps.slice(0, 40);
        const newestValues = values.slice(0, 40);
  
        // Format the timestamps
        const formattedTimestamps = newestTimestamps.map(t => t.format('HH:mm:ss'));
  
        // Remove old data points from the chart
        myLineChartP.data.labels = formattedTimestamps;
        myLineChartP.data.datasets[0].data = newestValues;
  
        // Update the chart
        myLineChartP.update();
      } else {
        console.error('Invalid data:', dataP);
      }
    } catch(error) {
      console.error('Error updating chart:', error);
    }
  }
  

// Start fetching data every 3 seconds
function fetchDataFromSensorAPI() {
    fetch('http://127.0.0.1:3000/api/get/sensor')
        .then(response => response.json())
        .then(response => {
            console.log("API response:", response);
            if (response.status === "success") {
                const data = response.data;
                console.log("Updating chart with data:", data);
                updateChart(data);
            } else {
                console.error(response.message);
            }
        })
        .catch(error => {
            console.error('Error fetching sensor data:', error);
        });
}

function fetchDataFromPredictAPI() {
    fetch('http://127.0.0.1:3000/api/get/predict')
        .then(response => response.json())
        .then(response => {
            console.log("API response:", response);
            if (response.status === "success") {
                const dataP = response.data;
                console.log("Updating chart with data:", dataP);
                updateChartP(dataP);
            } else {
                console.error(response.message);
            }
        })
        .catch(error => {
            console.error('Error fetching predict data:', error);
        });
}

setInterval(() => {
    console.log("Fetching data from API...");
    fetchDataFromSensorAPI();
    fetchDataFromPredictAPI();
}, 3000);
