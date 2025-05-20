document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('billingForm');
    const tableSelect = document.getElementById('customerName');
    const orderDetailsInput = document.getElementById('orderDetails');
    const totalAmountInput = document.getElementById('totalAmount');

    // Load table numbers
    async function loadTables() {
        const res = await fetch("http://localhost:8080/api/tables");
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
        const res = await fetch("http://localhost:8080/api/orders");
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
        const billRes = await fetch("http://localhost:8080/api/bills", {
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
            await fetch(`http://localhost:8080/api/orders/${orderId}`, {
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
    });

    loadTables();
});

function printBill(button) {
    const billDiv = button.parentElement;
    const billContent = billDiv.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = billContent;
    window.print();
    document.body.innerHTML = originalContent;
}
