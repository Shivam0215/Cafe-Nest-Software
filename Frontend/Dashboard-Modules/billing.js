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
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/orders`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const orders = await res.json();
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
            showToast(`No active order found for Table No ${tableNo}.`);
        }
    });

    // Fetch and display bills
    async function loadBills() {
        const billsDiv = document.getElementById('bills');
        billsDiv.innerHTML = '';
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/bills`, {
            headers: { "Authorization": "Bearer " + token }
        });
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
            showToast("Please select a table with an active order.");
            return;
        }

        const token = localStorage.getItem("token");

        // Save the bill
        const billRes = await fetch(`${BASE_URL}/api/bills`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ customerName, orderDetails, totalAmount })
        });
        if (!billRes.ok) {
            const errorText = await billRes.text();
            showToast("Bill not generated: " + errorText);
            return;
        }

        // Mark the order as completed
        if (orderId) {
            await fetch(`${BASE_URL}/api/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    customerName,
                    orderDetails,
                    totalAmount,
                    orderStatus: "Completed"
                })
            });
        }

        showToast("Bill generated and order completed successfully!");
        form.reset();
        orderDetailsInput.value = '';
        totalAmountInput.value = '';
        delete form.dataset.orderId;
        await loadBills();
    });

    loadTables();
    loadBills();
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
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/bills/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });
    if (res.ok) {
        showToast("Bill deleted.");
        loadBills();
    } else {
        const errorText = await res.text();
        console.error("Delete error:", errorText);
        showToast("Error deleting bill. Please try again.\n" + errorText);
    }
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.visibility = 'visible';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.visibility = 'hidden';
    }, duration);
}