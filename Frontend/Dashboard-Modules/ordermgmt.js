document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    const orderList = document.getElementById('orderList');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const customerName = document.getElementById('customerName').value;
        const orderDetails = document.getElementById('orderDetails').value;
        const orderStatus = document.getElementById('orderStatus').value;

        if (customerName && orderDetails) {
            const li = document.createElement('li');
            li.innerHTML = `${customerName} - ${orderDetails} - ${orderStatus} 
                            <button onclick="deleteOrder(this)">Delete</button>
                            <button onclick="updateOrderStatus(this)">Update Status</button>`;
            orderList.appendChild(li);

            form.reset();
        }
    });
});

function deleteOrder(button) {
    button.parentElement.remove();
}

function updateOrderStatus(button) {
    const newStatus = prompt("Enter new status (pending, in-progress, completed):");
    if (newStatus) {
        button.parentElement.innerHTML = button.parentElement.innerHTML.replace(/Pending|In Progress|Completed/, newStatus);
    }
}
