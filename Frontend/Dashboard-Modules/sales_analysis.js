const BASE_URL = location.hostname.includes("localhost")
    ? "http://localhost:8080"
    : "https://cafenest.onrender.com";

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem("token");
    // Fetch sales data (bills)
    const response = await fetch(`${BASE_URL}/api/bills`, {
        headers: { "Authorization": "Bearer " + token }
    });
    const bills = await response.json();

    const totalSalesElement = document.getElementById('totalSales');
    const totalOrdersElement = document.getElementById('totalOrders');

    // Calculate total sales and total orders
    let totalSales = 0;
    bills.forEach(bill => {
        totalSales += bill.totalAmount;
    });
    totalSalesElement.innerText = totalSales;
    totalOrdersElement.innerText = bills.length;

    // Group bills by date
    const grouped = {};
    bills.forEach(bill => {
        const date = bill.date || 'Unknown';
        grouped[date] = (grouped[date] || 0) + bill.totalAmount;
    });
    const labels = Object.keys(grouped);
    const salesData = Object.values(grouped);

    // Render sales chart using Chart.js
    const ctx = document.getElementById('salesCanvas').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales',
                data: salesData,
                backgroundColor: 'rgba(14, 97, 27, 0.7)',
                borderColor: 'green',
                borderWidth: 1
            }]
        }
    });
});
