const BASE_URL = location.hostname.includes("localhost")
    ? "http://localhost:8080"
    : "https://cafenest.onrender.com";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('billingForm');
    const tableSelect = document.getElementById('customerName');
    const orderDetailsInput = document.getElementById('orderDetails');
    const totalAmountInput = document.getElementById('totalAmount');

    // Load table numbers
    async function loadTables() {
        const res = await fetch(`${BASE_URL}/api/tables`);
        const tables = await res.json();
        tableSelect.innerHTML = '<option value="">Select Table No</option>';
        tables.forEach(table => {
            const option = document.createElement("option");
            option.value = table.tableNumber;
            option.textContent = `Table ${table.tableNumber}`;
            tableSelect.appendChild(option);
        });
    }

    // When table is selected, fetch the latest order for that table
    tableSelect.addEventListener('change', async function() {
        const tableNo = this.value;
        if (!tableNo) {
            orderDetailsInput.value = '';
            totalAmountInput.value = '';
            return;
        }
        const res = await fetch(`${BASE_URL}/api/orders`);
        const orders = await res.json();
        console.log("Orders:", orders, "Selected table:", tableNo);
        orders.forEach(o => {
            console.log(
                "Order customerName:", o.customerName,
                "orderStatus:", o.orderStatus,
                "Match:", String(o.customerName).trim() === String(tableNo).trim()
            );
        });
        const order = orders.reverse().find(o => 
            String(o.customerName).trim() === String(tableNo).trim() &&
            o.orderStatus &&
            o.orderStatus.toLowerCase() !== "completed"
        );
        if (order) {
            orderDetailsInput.value = order.orderDetails;
            totalAmountInput.value = order.totalAmount;
            form.dataset.orderId = order.id;
        } else {
            orderDetailsInput.value = '';
            totalAmountInput.value = '';
            delete form.dataset.orderId;
            alert(`No active order found for Table No ${tableNo}.`);
        }
    });

    // Add this function to fetch and display bills
    async function loadBills() {
        const billsDiv = document.getElementById('bills');
        billsDiv.innerHTML = '';
        const res = await fetch(`${BASE_URL}/api/bills`);
        const bills = await res.json();
        if (bills.length === 0) {
            billsDiv.innerHTML = "<p>No bills generated yet.</p>";
            return;
        }
        bills.forEach(bill => {
            const div = document.createElement('div');
            div.className = 'bill';
            div.innerHTML = `
                <strong>Table No:</strong> ${bill.customerName}<br>
                <strong>Order Details:</strong> ${bill.orderDetails}<br>
                <strong>Total Amount:</strong> ₹${bill.totalAmount}<br>
                <button onclick="printBill(this)">Print</button>
                <button onclick="deleteBill(${bill.id})" style="background-color:#e74c3c;color:white;margin-left:10px;">Delete</button>
            `;
            billsDiv.appendChild(div);
        });
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const customerName = tableSelect.value;
        const orderDetails = orderDetailsInput.value;
        const totalAmount = parseFloat(totalAmountInput.value);
        const orderId = form.dataset.orderId;

        if (!customerName || !orderDetails || !totalAmount) {
            alert("Please select a table with an active order.");
            return;
        }

        // Save the bill
        const billRes = await fetch(`${BASE_URL}/api/bills`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerName, orderDetails, totalAmount })
        });
        if (!billRes.ok) {
            const errorText = await billRes.text();
            alert("Bill not generated: " + errorText);
            return;
        }

        // Mark the order as completed
        if (orderId) {
            await fetch(`${BASE_URL}/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName,
                    orderDetails,
                    totalAmount,
                    orderStatus: "Completed"
                })
            });
        }

        alert("Bill saved and order marked as completed!");
        form.reset();
        orderDetailsInput.value = '';
        totalAmountInput.value = '';
        delete form.dataset.orderId;
        await loadBills(); // <-- Add this line to refresh the bill list
    });

    loadTables();
    loadBills(); // <-- Load bills on page load
});

function printBill(button) {
    const billDiv = button.parentElement;
    const billContent = billDiv.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = billContent;
    window.print();
    document.body.innerHTML = originalContent;
}

async function deleteBill(id) {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    const res = await fetch(`${BASE_URL}/api/bills/${id}`, {
        method: "DELETE"
    });
    if (res.ok) {
        alert("Bill deleted.");
        loadBills();
    } else {
        const errorText = await res.text();
        console.error("Delete error:", errorText);
        alert("Error deleting bill. Please try again.\n" + errorText);
    }
}
