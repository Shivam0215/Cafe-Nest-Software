if (localStorage.getItem("isLoggedIn") === "true" || localStorage.getItem("user")) {
    window.location.replace("Dashboard-Modules/index.html");
}

const loginUrl = "https://cafenest.onrender.com/api/users/login";

document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showToast("Please enter both email and password.");
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
            showToast("Login successful!");
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("token", user.token);
            localStorage.setItem("user", JSON.stringify(user.user));
            window.location.replace("Dashboard-Modules/index.html");
        } else {
            const errorText = await response.text();
            showToast(errorText || "Invalid email or password.");
        }
    } catch (err) {
        showToast("Network error. Please try again.");
    }
    submitBtn.disabled = false;
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
