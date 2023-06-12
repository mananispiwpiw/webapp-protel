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
                    max: 20 // Change this to your desired Y-axis maximum value
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
    console.log("Updating chart with data:", data);
    // Parse the timestamps using moment.js and sort the data by timestamp (newest to oldest)
    data = data.map(d => ({...d, Timestamp: moment(d.Timestamp)})).sort((a, b) => b.Timestamp.diff(a.Timestamp));

    // Extract x and y values from the fetched data
    const timestamps = data.map(d => moment(d.Timestamp));
    const values = data.map(d => d.Value);

    //Format the timestamps
    //const formattedTimestamps = timestamps.map(t => t.format('HH:mm:ss (DD/MM/YYYY)')).reverse();
    const formattedTimestamps = timestamps.map(t => t.format('HH:mm:ss'));
    // Reverse the values array so they match the order of the timestamps
    //const reversedValues = values.reverse();
    // Remove old data points from the chart
    while (myLineChart.data.labels.length >= MAX_DATA_POINTS) {
      myLineChart.data.labels.shift();
      myLineChart.data.datasets[0].data.shift();
    }
    

    // Add the new data points to the chart
    myLineChart.data.labels.push(...formattedTimestamps); 
    myLineChart.data.datasets[0].data.push(...values);

    // Remove old data points if there are too many
    // if (myLineChart.data.labels.length > MAX_DATA_POINTS) {
    //     myLineChart.data.labels.splice(0, myLineChart.data.labels.length - MAX_DATA_POINTS);
    //     myLineChart.data.datasets[0].data.splice(0, myLineChart.data.datasets[0].data.length - MAX_DATA_POINTS);
    // }
     // Check if chart is already populated
     if (myLineChart.data.labels.length > 0) {
        // Replace existing data with new data
        myLineChart.data.labels = formattedTimestamps;
        myLineChart.data.datasets[0].data = values;
    } else {
        // Append new data to the chart
        myLineChart.data.labels.push(...formattedTimestamps);
        myLineChart.data.datasets[0].data.push(...values);
    }
    
    // Update the chart
    myLineChart.update();
} catch(error){
  console.error('Error updating chart:', error);
}
}

// Start fetching data every 3 seconds
setInterval(() => {
    console.log("Fetching data from API...");
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
            console.error(error);
        });
}, 3000);
