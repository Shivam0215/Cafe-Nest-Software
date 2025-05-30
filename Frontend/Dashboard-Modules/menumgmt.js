const BASE_URL = location.hostname.includes("localhost")
    ? "http://localhost:8080"
    : "https://cafenest.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("add-menu-form");
    const nameInput = document.getElementById("item-name");
    const priceInput = document.getElementById("item-price");
    const tableBody = document.getElementById("menu-table-body");
    let editingId = null;

    async function loadMenuItems() {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/menu`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const menuItems = await response.json();
        tableBody.innerHTML = "";
        menuItems.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
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
        const token = localStorage.getItem("token");

        if (editingId) {
            await fetch(`${BASE_URL}/api/menu/${editingId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ name, price })
            });
            editingId = null;
            form.querySelector("button[type='submit']").textContent = "Add Item";
        } else {
            await fetch(`${BASE_URL}/api/menu`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ name, price })
            });
        }
        form.reset();
        loadMenuItems();
    });

    tableBody.addEventListener("click", async function(e) {
        const id = e.target.dataset.id;
        const token = localStorage.getItem("token");
        if (e.target.classList.contains("delete-btn")) {
            await fetch(`${BASE_URL}/api/menu/${id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });
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
