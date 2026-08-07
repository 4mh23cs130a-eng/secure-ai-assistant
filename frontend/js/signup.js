const signupForm = document.getElementById("signupForm");

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const strength = document.getElementById("strength");
const strengthText = document.getElementById("strengthText");

const loading = document.getElementById("loading");
const message = document.getElementById("message");
const signupBtn = document.getElementById("signupBtn");


// -----------------------------
// Show / Hide Password
// -----------------------------

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


// -----------------------------
// Password Strength
// -----------------------------

password.addEventListener("input", () => {

    let score = 0;

    const pass = password.value;

    if (pass.length >= 8) score++;

    if (/[A-Z]/.test(pass)) score++;

    if (/[0-9]/.test(pass)) score++;

    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch(score){

        case 1:

            strength.style.width="25%";
            strength.style.background="red";
            strengthText.innerText="Weak Password";

            break;

        case 2:

            strength.style.width="50%";
            strength.style.background="orange";
            strengthText.innerText="Medium Password";

            break;

        case 3:

            strength.style.width="75%";
            strength.style.background="#00bfff";
            strengthText.innerText="Good Password";

            break;

        case 4:

            strength.style.width="100%";
            strength.style.background="limegreen";
            strengthText.innerText="Strong Password";

            break;

        default:

            strength.style.width="0";
            strengthText.innerText="Password Strength";

    }

});


// -----------------------------
// Signup
// -----------------------------

signupForm.addEventListener("submit", async (e)=>{

    e.preventDefault();

    message.innerHTML="";

    if(password.value !== confirmPassword.value){

        message.style.color="yellow";
        message.innerHTML="Passwords do not match.";

        return;

    }

    loading.style.display="flex";

    signupBtn.disabled=true;

    try{

        const response = await fetch("http://127.0.0.1:5000/signup",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                username:username.value,

                email:email.value,

                password:password.value

            })

        });

        const data = await response.json();

        loading.style.display="none";

        signupBtn.disabled=false;

        if(data.success){

            message.style.color="lightgreen";

            message.innerHTML=data.message;

            setTimeout(()=>{

                window.location.href="login.html";

            },1500);

        }

        else{

            message.style.color="yellow";

            message.innerHTML=data.message;

        }

    }

    catch(error){

        loading.style.display="none";

        signupBtn.disabled=false;

        message.style.color="red";

        message.innerHTML="Cannot connect to backend.";

    }

});