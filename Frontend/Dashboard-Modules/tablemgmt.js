const BASE_URL = location.hostname.includes("localhost")
    ? "http://localhost:8080"
    : "https://cafenest.onrender.com";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tableForm');
    const tableNumberInput = document.getElementById('tableNumber');
    const seatingCapacityInput = document.getElementById('seatingCapacity');
    const tableBody = document.getElementById('table-table-body');
    let editingId = null;

    async function fetchTables() {
        const res = await fetch(`${BASE_URL}/api/tables`);
        const tables = await res.json();
        tableBody.innerHTML = "";
        tables.forEach(table => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${table.id}</td>
                <td>${table.tableNumber}</td>
                <td>${table.seatingCapacity}</td>
                <td>
                    <button class="edit-btn" data-id="${table.id}" data-number="${table.tableNumber}" data-capacity="${table.seatingCapacity}">Edit</button>
                    <button class="delete-btn" data-id="${table.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const tableNumber = tableNumberInput.value;
        const seatingCapacity = seatingCapacityInput.value;

        if (editingId) {
            await fetch(`${BASE_URL}/api/tables/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tableNumber, seatingCapacity })
            });
            editingId = null;
            form.querySelector("button[type='submit']").textContent = "Add Table";
        } else {
            await fetch(`${BASE_URL}/api/tables`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tableNumber, seatingCapacity })
            });
        }
        form.reset();
        fetchTables();
    });

    tableBody.addEventListener("click", async function(e) {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("delete-btn")) {
            await fetch(`${BASE_URL}/api/tables/${id}`, { method: "DELETE" });
            fetchTables();
        }
        if (e.target.classList.contains("edit-btn")) {
            tableNumberInput.value = e.target.dataset.number;
            seatingCapacityInput.value = e.target.dataset.capacity;
            editingId = id;
            form.querySelector("button[type='submit']").textContent = "Update Table";
        }
    });

    fetchTables();
});
