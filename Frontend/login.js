if (localStorage.getItem("isLoggedIn") === "true" || localStorage.getItem("user")) {
    window.location.replace("Dashboard-Modules/index.html");
}

document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const user = await response.json();
            alert("Login successful!");
            window.location.replace("Dashboard-Modules/index.html");
            // Save user info or redirect as needed
        } else {
            const errorData = await response.json();
            alert("Login failed: " + (errorData.message || "Check your credentials."));
            console.error("Login failed:", errorData);
        }
    } catch (err) {
        alert("An error occurred during login.");
        console.error("Network or server error:", err);
    }
});