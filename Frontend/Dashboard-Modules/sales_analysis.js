document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch("http://localhost:8080/api/sales");
    const salesData = await response.json();

    const totalSalesElement = document.getElementById('totalSales');
    const totalOrdersElement = document.getElementById('totalOrders');

    // Calculate total sales and total orders
    let totalSales = 0;
    salesData.forEach(data => {
        totalSales += data.sales;
    });
    totalSalesElement.innerText = totalSales;
    totalOrdersElement.innerText = salesData.length;

    // Render sales chart using Chart.js
    const ctx = document.getElementById('salesCanvas').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.map(d => d.date),
            datasets: [{
                label: 'Sales',
                data: salesData.map(d => d.sales),
                borderColor: 'green',
                fill: false
            }]
        }
    });
});
