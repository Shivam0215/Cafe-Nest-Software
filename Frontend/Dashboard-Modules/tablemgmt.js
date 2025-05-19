document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tableForm');
    const tableList = document.getElementById('tableList');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const tableNumber = document.getElementById('tableNumber').value;
        const seatingCapacity = document.getElementById('seatingCapacity').value;

        if (tableNumber && seatingCapacity) {
            const li = document.createElement('li');
            li.innerHTML = `Table ${tableNumber} - Seats ${seatingCapacity} 
                            <button onclick="deleteTable(this)">Delete</button>
                            <button onclick="updateTable(this)">Update</button>`;
            tableList.appendChild(li);

            form.reset();
        }
    });
});

function deleteTable(button) {
    button.parentElement.remove();
}

function updateTable(button) {
    const newSeatingCapacity = prompt("Enter new seating capacity:");
    if (newSeatingCapacity) {
        button.parentElement.innerHTML = button.parentElement.innerHTML.replace(/Seats \d+/, `Seats ${newSeatingCapacity}`);
    }
}
