// Add this line at the beginning of the file to declare 'dataTableInstance' variable
let dataTableInstance;

window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        // Modify this line to use 'dataTableInstance'
        dataTableInstance = new simpleDatatables.DataTable(datatablesSimple);
    }
});

// Add this line at the end of the file to export 'dataTableInstance'
export { dataTableInstance };
