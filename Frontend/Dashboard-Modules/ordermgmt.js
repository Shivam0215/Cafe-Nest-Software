document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-order-form');
    const tableSelect = document.getElementById('customer-name');
    const orderItemsSelect = document.getElementById('order-items');
    const orderTotalInput = document.getElementById('order-total');
    let menuItems = [];

    // Fetch table numbers
    async function loadTables() {
        const response = await fetch("http://localhost:8080/api/tables");
        const tables = await response.json();
        tableSelect.innerHTML = '<option value="">Select Table No</option>';
        tables.forEach(table => {
            const option = document.createElement("option");
            option.value = table.tableNumber;
            option.textContent = `Table ${table.tableNumber}`;
            tableSelect.appendChild(option);
        });
    }

    // Fetch menu items
    async function loadMenuItems() {
        const response = await fetch("http://localhost:8080/api/menu");
        menuItems = await response.json();
        orderItemsSelect.innerHTML = "";
        menuItems.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = `${item.name} - ₹${item.price}`;
            orderItemsSelect.appendChild(option);
        });
    }

    // Calculate total when items are selected
    orderItemsSelect.addEventListener('change', () => {
        let total = 0;
        Array.from(orderItemsSelect.selectedOptions).forEach(option => {
            const item = menuItems.find(i => i.id == option.value);
            if (item) total += Number(item.price);
        });
        orderTotalInput.value = total;
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const customerName = tableSelect.value;
        const orderStatus = document.getElementById('order-status').value.trim();
        const selectedOptions = Array.from(orderItemsSelect.selectedOptions);
        const orderDetails = selectedOptions.map(option => option.textContent).join(', ');
        const totalAmount = parseFloat(orderTotalInput.value);

        const editingOrderId = form.dataset.editingOrderId;

        if (editingOrderId) {
            // Update existing order
            await fetch(`http://localhost:8080/api/orders/${editingOrderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName,
                    orderDetails,
                    orderStatus,
                    totalAmount
                })
            });
            delete form.dataset.editingOrderId;
            form.querySelector("button[type='submit']").textContent = "Add Order";
        } else {
            // Check for existing order for this table (not completed)
            const ordersRes = await fetch("http://localhost:8080/api/orders");
            const orders = await ordersRes.json();
            const existingOrder = orders.find(order => order.customerName == customerName && order.orderStatus.toLowerCase() !== "completed");

            if (existingOrder) {
                // Update existing order
                const updatedOrderDetails = existingOrder.orderDetails
                    ? existingOrder.orderDetails + ", " + orderDetails
                    : orderDetails;
                const updatedTotal = Number(existingOrder.totalAmount) + totalAmount;

                await fetch(`http://localhost:8080/api/orders/${existingOrder.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customerName,
                        orderDetails: updatedOrderDetails,
                        orderStatus,
                        totalAmount: updatedTotal
                    })
                });
            } else {
                // Add new order
                await fetch("http://localhost:8080/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customerName: String(tableSelect.value),
                        orderDetails,
                        orderStatus,
                        totalAmount
                    })
                });
            }
        }

        form.reset();
        orderTotalInput.value = "";
        loadOrders();
    });

    // Load orders as before
    async function loadOrders() {
        const response = await fetch("http://localhost:8080/api/orders");
        const orders = await response.json();
        const tableBody = document.getElementById("order-table-body");
        tableBody.innerHTML = "";
        orders.forEach((order, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td> <!-- Serial number -->
                <td>${order.customerName}</td>
                <td>${order.orderDetails}</td>
                <td>${order.orderStatus}</td>
                <td>${order.totalAmount}</td>
                <td>
                    <button class="edit-order-btn" data-id="${order.id}">Edit</button>
                    <button class="delete-order-btn" data-id="${order.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    document.getElementById("order-table-body").addEventListener("click", async function(e) {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("delete-order-btn")) {
            if (confirm("Are you sure you want to delete this order?")) {
                await fetch(`http://localhost:8080/api/orders/${id}`, { method: "DELETE" });
                loadOrders();
            }
        }
        if (e.target.classList.contains("edit-order-btn")) {
            // Fetch order details and fill the form for editing
            const response = await fetch(`http://localhost:8080/api/orders/${id}`);
            if (response.ok) {
                const order = await response.json();
                document.getElementById('customer-name').value = order.customerName;
                document.getElementById('order-status').value = order.orderStatus;
                document.getElementById('order-total').value = order.totalAmount;
                // Optionally, set selected menu items if you store them as IDs
                form.dataset.editingOrderId = id;
                form.querySelector("button[type='submit']").textContent = "Update Order";
            }
        }
    });

    loadTables();
    loadMenuItems();
    loadOrders();
});
