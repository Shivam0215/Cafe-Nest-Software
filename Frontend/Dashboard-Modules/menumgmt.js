document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("add-menu-form");
    const nameInput = document.getElementById("item-name");
    const priceInput = document.getElementById("item-price");
    const tableBody = document.getElementById("menu-table-body");
    let editingId = null;

    async function loadMenuItems() {
        const response = await fetch("http://localhost:8080/api/menu");
        const menuItems = await response.json();
        tableBody.innerHTML = "";
        menuItems.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>
                    <button class="edit-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        const price = priceInput.value.trim();

        if (editingId) {
            await fetch(`http://localhost:8080/api/menu/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price })
            });
            editingId = null;
            form.querySelector("button[type='submit']").textContent = "Add Item";
        } else {
            await fetch("http://localhost:8080/api/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price })
            });
        }
        form.reset();
        loadMenuItems();
    });

    tableBody.addEventListener("click", async function(e) {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("delete-btn")) {
            await fetch(`http://localhost:8080/api/menu/${id}`, { method: "DELETE" });
            loadMenuItems();
        }
        if (e.target.classList.contains("edit-btn")) {
            nameInput.value = e.target.dataset.name;
            priceInput.value = e.target.dataset.price;
            editingId = id;
            form.querySelector("button[type='submit']").textContent = "Update Item";
        }
    });

    loadMenuItems();
});
