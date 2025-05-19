document.addEventListener('DOMContentLoaded', () => {
    const totalSalesElement = document.getElementById('totalSales');
    const totalOrdersElement = document.getElementById('totalOrders');

    // Example sales data
    const salesData = [
        { date: '2025-01-01', sales: 150 },
        { date: '2025-01-02', sales: 200 },
        { date: '2025-01-03', sales: 250 },
        { date: '2025-01-04', sales: 300 },
        { date: '2025-01-05', sales: 350 }
    ];

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
            labels: salesData.map(data => data.date),
            datasets: [{
                label: 'Daily Sales',
                data: salesData.map(data => data.sales),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Sales Amount ($)'
                    }
                }
            }
        }
    });
});
