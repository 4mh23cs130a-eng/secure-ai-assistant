const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const loading = document.getElementById("loading");
const message = document.getElementById("message");

// ------------------------------
// Show / Hide Password
// ------------------------------

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);

        const icon = button.querySelector("i");

        if (input.type === "password") {

            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");

        } else {

            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");

        }

    });

});


// ------------------------------
// Login
// ------------------------------

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";

    loading.style.display = "flex";
    loginBtn.disabled = true;

    try {

        const response = await fetch("http://127.0.0.1:5000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: email.value.trim(),
                password: password.value

            })

        });

        const data = await response.json();

        loading.style.display = "none";
        loginBtn.disabled = false;

        if (data.success) {

            // Save Login Status
            localStorage.setItem("loggedIn", "true");

            // Save User Details
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("email", data.user.email);

            message.style.color = "#00ff88";
            message.innerHTML = "✅ Login Successful";

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1000);

        } else {

            message.style.color = "#ff4444";
            message.innerHTML = data.message;

        }

    }

    catch (error) {

        loading.style.display = "none";
        loginBtn.disabled = false;

        message.style.color = "#ff4444";
        message.innerHTML = "Cannot connect to backend.";

        console.error(error);

    }

});