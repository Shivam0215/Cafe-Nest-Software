document.getElementById("register-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const name = firstName + " " + lastName;
    const cafeName = document.getElementById("cafe-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cafeName, email, password })
    })
    .then(response => response.json())
    .then(data => {
        // Handle success, e.g. redirect or show message
        console.log(data);
        window.location.href = "login.html";
    })
    .catch(error => {
        // Handle error
        alert("Registration failed!");
    });
});