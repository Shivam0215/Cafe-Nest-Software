document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('employeeForm');
    const employeeList = document.getElementById('employeeList');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const salary = document.getElementById('salary').value;

        if (name && position && salary) {
            const li = document.createElement('li');
            li.innerHTML = `${name} - ${position} - $${salary} <button onclick="deleteEmployee(this)">Delete</button>`;
            employeeList.appendChild(li);

            form.reset();
        }
    });
});

function deleteEmployee(button) {
    button.parentElement.remove();
}
