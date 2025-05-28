if (localStorage.getItem("isLoggedIn") === "true" || localStorage.getItem("user")) {
    window.location.replace("Dashboard-Modules/index.html");
}

const loginUrl = "https://cafenest.onrender.com/api/users/login";

document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const submitBtn = this.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    try {
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const user = await response.json();
            alert("Login successful!");
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email
            }));
            window.location.replace("Dashboard-Modules/index.html");
        } else {
            const errorText = await response.text();
            alert("Login failed: " + errorText);
            console.error("Login failed:", errorText);
        }
    } catch (err) {
        alert("An error occurred during login.");
        console.error("Network or server error:", err);
    } finally {
        submitBtn.disabled = false;
    }
});
