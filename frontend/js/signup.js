const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const submitButton = signupForm.querySelector("button");
    submitButton.disabled = true;
    submitButton.innerText = "Creating Account...";

    try {

        const response = await fetch("http://127.0.0.1:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {

            alert("🎉 Account created successfully!");

            signupForm.reset();

            window.location.href = "login.html";

        } else {

            alert(result.message || "Signup failed.");

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to backend.");

    } finally {

        submitButton.disabled = false;
        submitButton.innerText = "Create Account";

    }

});