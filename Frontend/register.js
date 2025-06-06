import { showToast } from "./toast.js";

const apiUrl = "https://cafenest.onrender.com/api/users/register";

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.getElementById("register-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const name = firstName + " " + lastName;
    const cafeName = document.getElementById("cafe-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!firstName || !lastName || !email || !password) {
        showToast("Please fill in all required fields.");
        return;
    }
    if (!validateEmail(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
    }
    if (password.length < 8) {
        showToast("Password must be at least 8 characters.", "error");
        return;
    }

    const btn = document.querySelector(".register-btn");
    btn.disabled = true;
    btn.textContent = "Registering...";

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
        showToast("Registration successful! Please log in.");
        window.location.href = "login.html";
    } catch (error) {
        showToast("Registration failed: " + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "Register";
    }
});

document.getElementById("show-password").addEventListener("change", function() {
    const pwd = document.getElementById("password");
    pwd.type = this.checked ? "text" : "password";
});

document.getElementById("password").addEventListener("input", function() {
    const val = this.value;
    const strength = document.getElementById("password-strength");
    if (val.length < 6) {
        strength.textContent = "Weak";
        strength.style.color = "red";
    } else if (val.match(/[A-Z]/) && val.match(/[0-9]/) && val.length >= 8) {
        strength.textContent = "Strong";
        strength.style.color = "green";
    } else {
        strength.textContent = "Medium";
        strength.style.color = "orange";
    }
});

window.onload = function() {
    document.getElementById("first-name").focus();
};
