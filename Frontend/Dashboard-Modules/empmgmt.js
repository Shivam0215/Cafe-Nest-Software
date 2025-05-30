const BASE_URL = location.hostname.includes("localhost")
    ? "http://localhost:8080"
    : "https://cafenest.onrender.com";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("employeeForm");
    const tableBody = document.getElementById("employee-table-body");
    let employees = [];
    let editingId = null;

    async function fetchEmployees() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/employees`, {
                headers: { "Authorization": "Bearer " + token }
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Error: ${res.status} - ${errorText}`);
            }
            employees = await res.json();
            renderEmployees();
        } catch (err) {
            console.error("Failed to fetch employees:", err.message);
            showToast("Could not load employee data. Please try again later.");
        }
    }

    function renderEmployees() {
        tableBody.innerHTML = "";
        employees.forEach((emp, idx) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${idx + 1}</td>
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.salary}</td>
                <td>
                    <button class="edit-btn" data-id="${emp.id}">Edit</button>
                    <button class="delete-btn" data-id="${emp.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const position = document.getElementById("position").value.trim();
        const salary = parseFloat(document.getElementById("salary").value.trim());
        const token = localStorage.getItem("token");

        if (editingId) {
            // Update employee
            await fetch(`${BASE_URL}/api/employees/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ name, position, salary })
            });
            editingId = null;
            form.querySelector("button[type='submit']").textContent = "Add Employee";
        } else {
            // Add employee
            await fetch(`${BASE_URL}/api/employees`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ name, position, salary })
            });
        }

        form.reset();
        fetchEmployees();
    });

    tableBody.addEventListener("click", async function (e) {
        const id = e.target.dataset.id;
        const token = localStorage.getItem("token");
        if (e.target.classList.contains("delete-btn")) {
            await fetch(`${BASE_URL}/api/employees/${id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });
            fetchEmployees();
        }
        if (e.target.classList.contains("edit-btn")) {
            const emp = employees.find(emp => emp.id == id);
            document.getElementById("name").value = emp.name;
            document.getElementById("position").value = emp.position;
            document.getElementById("salary").value = emp.salary;
            editingId = id;
            form.querySelector("button[type='submit']").textContent = "Update Employee";
        }
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

    fetchEmployees();
});
