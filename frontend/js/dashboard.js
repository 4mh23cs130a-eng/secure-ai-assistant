// =====================================================
// SECURE AI ASSISTANT - DASHBOARD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =================================================
    // USER INFORMATION
    // =================================================

    const usernameElement = document.getElementById("username");

    const savedUsername = localStorage.getItem("username");

    if (savedUsername && usernameElement) {
        usernameElement.textContent = savedUsername;
    }


    // =================================================
    // CHAT ELEMENTS
    // =================================================

    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");


    // =================================================
    // LOAD SAVED CHAT
    // =================================================

    let chatHistory =
        JSON.parse(localStorage.getItem("chatHistory")) || [];


    function displayMessage(message, type) {

        const messageDiv = document.createElement("div");

        messageDiv.classList.add("message");
        messageDiv.classList.add(type);

        messageDiv.textContent = message;

        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    function saveChatMessage(message, type) {

        chatHistory.push({
            message: message,
            type: type,
            time: new Date().toISOString()
        });

        localStorage.setItem(
            "chatHistory",
            JSON.stringify(chatHistory)
        );
    }


    // =================================================
    // SEND MESSAGE TO FLASK BACKEND
    // =================================================

    chatForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message) {
            return;
        }


        // Display user's message

        displayMessage(message, "user");

        saveChatMessage(message, "user");


        // Clear input

        chatInput.value = "";


        // Show typing message

        const typingMessage =
            document.createElement("div");

        typingMessage.className =
            "message bot";

        typingMessage.id =
            "typingMessage";

        typingMessage.textContent =
            "AI is thinking...";

        chatMessages.appendChild(
            typingMessage
        );

        chatMessages.scrollTop =
            chatMessages.scrollHeight;


        try {

            // =========================================
            // CALL FLASK BACKEND
            // =========================================

            const response = await fetch(
                "http://127.0.0.1:5000/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


            const data = await response.json();


            // Remove typing message

            const typing =
                document.getElementById(
                    "typingMessage"
                );

            if (typing) {
                typing.remove();
            }


            // =========================================
            // SUCCESS
            // =========================================

            if (response.ok && data.success) {

                const aiReply =
                    data.response ||
                    data.message ||
                    data.reply ||
                    "AI did not return a response.";


                displayMessage(
                    aiReply,
                    "bot"
                );


                saveChatMessage(
                    aiReply,
                    "bot"
                );

            }

            else {

                displayMessage(
                    data.message ||
                    "Unable to get a response from AI backend.",
                    "bot"
                );

            }

        }

        catch (error) {

            console.error(
                "Chat API Error:",
                error
            );


            const typing =
                document.getElementById(
                    "typingMessage"
                );

            if (typing) {
                typing.remove();
            }


            displayMessage(
                "Unable to connect to AI backend. Make sure Flask is running on port 5000.",
                "bot"
            );

        }

    });


    // =================================================
    // NEW CHAT
    // =================================================

    const newChatButton =
        document.getElementById("newChat");


    if (newChatButton) {

        newChatButton.addEventListener(
            "click",
            () => {

                chatMessages.innerHTML = "";

                const welcomeMessage =
                    "👋 Hello! Welcome to Secure AI Assistant. How can I help you today?";

                displayMessage(
                    welcomeMessage,
                    "bot"
                );

            }
        );

    }


    // =================================================
    // CHAT HISTORY
    // =================================================

    const historyButton =
        document.getElementById("chatHistory");


    if (historyButton) {

        historyButton.addEventListener(
            "click",
            () => {

                chatMessages.innerHTML = "";


                if (chatHistory.length === 0) {

                    displayMessage(
                        "No chat history available.",
                        "bot"
                    );

                    return;
                }


                chatHistory.forEach(item => {

                    displayMessage(
                        item.message,
                        item.type
                    );

                });

            }
        );

    }


    // =================================================
    // SAVED CHATS
    // =================================================

    const savedChatsButton =
        document.getElementById("savedChats");


    if (savedChatsButton) {

        savedChatsButton.addEventListener(
            "click",
            () => {

                const savedChats =
                    JSON.parse(
                        localStorage.getItem(
                            "savedChats"
                        )
                    ) || [];


                chatMessages.innerHTML = "";


                if (savedChats.length === 0) {

                    displayMessage(
                        "No saved chats yet.",
                        "bot"
                    );

                    return;
                }


                savedChats.forEach(chat => {

                    displayMessage(
                        chat,
                        "bot"
                    );

                });

            }
        );

    }


    // =================================================
    // FAVORITES
    // =================================================

    const favoritesButton =
        document.getElementById("favorites");


    if (favoritesButton) {

        favoritesButton.addEventListener(
            "click",
            () => {

                const favorites =
                    JSON.parse(
                        localStorage.getItem(
                            "favorites"
                        )
                    ) || [];


                chatMessages.innerHTML = "";


                if (favorites.length === 0) {

                    displayMessage(
                        "No favorite chats yet.",
                        "bot"
                    );

                    return;
                }


                favorites.forEach(item => {

                    displayMessage(
                        item,
                        "bot"
                    );

                });

            }
        );

    }


    // =================================================
    // SAVE CURRENT CHAT
    // =================================================

    const saveChatButton =
        document.getElementById("saveChat");


    if (saveChatButton) {

        saveChatButton.addEventListener(
            "click",
            () => {

                const savedChats =
                    JSON.parse(
                        localStorage.getItem(
                            "savedChats"
                        )
                    ) || [];


                if (chatHistory.length === 0) {

                    alert(
                        "There is no chat to save."
                    );

                    return;
                }


                savedChats.push(
                    new Date().toLocaleString()
                );


                localStorage.setItem(
                    "savedChats",
                    JSON.stringify(savedChats)
                );


                alert(
                    "Chat saved successfully!"
                );

            }
        );

    }


    // =================================================
    // LOGOUT
    // =================================================

    const logoutButton =
        document.getElementById("logoutBtn");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "username"
                );

                localStorage.removeItem(
                    "email"
                );

                localStorage.removeItem(
                    "chatHistory"
                );


                window.location.href =
                    "login.html";

            }
        );

    }

});