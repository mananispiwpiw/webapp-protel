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