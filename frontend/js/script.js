const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Backend URL
const API_URL = "http://127.0.0.1:5000/chat";

// Add a message to the chat
function addMessage(message, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", sender);

    messageDiv.innerHTML = `<strong>${sender === "user" ? "You" : "AI"}:</strong> ${message}`;

    chatBox.appendChild(messageDiv);

    // Auto scroll
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message
async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    // Display user's message
    addMessage(message, "user");

    userInput.value = "";

    // Loading message
    addMessage("Thinking...", "bot");

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

        // Remove "Thinking..."
        chatBox.removeChild(chatBox.lastChild);

        if (data.success) {
            addMessage(data.response, "bot");
        } else {
            addMessage(data.error, "bot");
        }

    } catch (error) {

        chatBox.removeChild(chatBox.lastChild);

        addMessage("Unable to connect to the backend.", "bot");

        console.error(error);
    }

}

// Button click
sendBtn.addEventListener("click", sendMessage);

// Press Enter
userInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});