const apiUrl = "https://cafenest.onrender.com/api/users/register";

document.getElementById("register-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const name = firstName + " " + lastName;
    const cafeName = document.getElementById("cafe-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!firstName || !lastName || !email || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, cafeName, email, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        console.log(data);
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
    } catch (error) {
        alert("Registration failed: " + error.message);
    }
});
