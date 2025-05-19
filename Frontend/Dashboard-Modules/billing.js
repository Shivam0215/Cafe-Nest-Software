document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('billingForm');
    const billsContainer = document.getElementById('bills');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const customerName = document.getElementById('customerName').value;
        const orderDetails = document.getElementById('orderDetails').value;
        const totalAmount = document.getElementById('totalAmount').value;

        if (customerName && orderDetails && totalAmount) {
            const billDiv = document.createElement('div');
            billDiv.classList.add('bill');
            billDiv.innerHTML = `<h3>Bill for Table No${customerName}</h3>
                                 <p>Order: ${orderDetails}</p>
                                 <p>Total Amount: $${totalAmount}</p>
                                 <button onclick="printBill(this)">Print Bill</button>`;
            billsContainer.appendChild(billDiv);

            form.reset();
        }
    });
});

function printBill(button) {
    const billDiv = button.parentElement;
    const billContent = billDiv.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = billContent;
    window.print();
    document.body.innerHTML = originalContent;
}
