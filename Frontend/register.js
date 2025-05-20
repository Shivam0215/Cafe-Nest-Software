document.getElementById("register-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const name = firstName + " " + lastName;
    const cafeName = document.getElementById("cafe-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cafeName, email, password })
    });

    if (response.ok) {
        alert("Registration successful!");
        window.location.href = "login.html";
    } else {
        const error = await response.text();
        if (error.includes("Email already exists")) {
            alert("This email is already registered. Please use a different email.");
        } else {
            alert("Registration failed: " + error);
        }
    }
});