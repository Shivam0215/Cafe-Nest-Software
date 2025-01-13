document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('menuForm');
    const menuList = document.getElementById('menuList');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const itemName = document.getElementById('itemName').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;

        if (itemName && category && price) {
            const li = document.createElement('li');
            li.innerHTML = `${itemName} - ${category} - $${price} <button onclick="deleteMenuItem(this)">Delete</button>`;
            menuList.appendChild(li);

            form.reset();
        }
    });
});

function deleteMenuItem(button) {
    button.parentElement.remove();
}
