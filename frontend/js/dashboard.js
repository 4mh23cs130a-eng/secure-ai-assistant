// =====================================================
// SECURE AI ASSISTANT - DASHBOARD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // ELEMENTS
    // =================================================

    const chatContainer =
        document.getElementById("chatContainer");

    const chatMessages =
        document.getElementById("chatMessages");

    const chatForm =
        document.getElementById("chatForm");

    const chatInput =
        document.getElementById("chatInput");

    const sendBtn =
        document.getElementById("sendBtn");

    const chatStatus =
        document.getElementById("chatStatus");


    const historyPanel =
        document.getElementById("historyPanel");

    const savedPanel =
        document.getElementById("savedPanel");

    const favoritesPanel =
        document.getElementById("favoritesPanel");


    const featureGrid =
        document.getElementById("featureGrid");



    // =================================================
    // USER INFORMATION
    // =================================================

    const username =
        localStorage.getItem("username") || "User";


    document.getElementById(
        "welcomeUsername"
    ).textContent = username;


    document.getElementById(
        "sidebarUsername"
    ).textContent = username;


    document.getElementById(
        "topUsername"
    ).textContent = username;



    // =================================================
    // LOCAL STORAGE
    // =================================================

    let conversation =
        JSON.parse(
            localStorage.getItem("currentConversation")
        ) || [];


    let history =
        JSON.parse(
            localStorage.getItem("chatHistory")
        ) || [];


    let savedChats =
        JSON.parse(
            localStorage.getItem("savedChats")
        ) || [];


    let favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];



    // =================================================
    // SHOW SECTION
    // =================================================

    function showChat() {

        chatContainer.classList.remove("hidden");

        historyPanel.classList.add("hidden");

        savedPanel.classList.add("hidden");

        favoritesPanel.classList.add("hidden");

        featureGrid.classList.remove("hidden");

        document.getElementById(
            "pageTitle"
        ).textContent =
            "Secure AI Assistant";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Your intelligent AI companion";

    }


    function showHistory() {

        chatContainer.classList.add("hidden");

        historyPanel.classList.remove("hidden");

        savedPanel.classList.add("hidden");

        favoritesPanel.classList.add("hidden");

        featureGrid.classList.add("hidden");

        document.getElementById(
            "pageTitle"
        ).textContent =
            "Chat History";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "View your previous conversations";

        renderHistory();

    }


    function showSaved() {

        chatContainer.classList.add("hidden");

        historyPanel.classList.add("hidden");

        savedPanel.classList.remove("hidden");

        favoritesPanel.classList.add("hidden");

        featureGrid.classList.add("hidden");

        document.getElementById(
            "pageTitle"
        ).textContent =
            "Saved Chats";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Your saved conversations";

        renderSaved();

    }


    function showFavorites() {

        chatContainer.classList.add("hidden");

        historyPanel.classList.add("hidden");

        savedPanel.classList.add("hidden");

        favoritesPanel.classList.remove("hidden");

        featureGrid.classList.add("hidden");

        document.getElementById(
            "pageTitle"
        ).textContent =
            "Favorites";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Your favorite messages";

        renderFavorites();

    }



    // =================================================
    // ADD MESSAGE TO SCREEN
    // =================================================

    function addMessage(
        text,
        type,
        save = true
    ) {

        const row =
            document.createElement("div");


        row.className =
            "message-row " +
            (type === "user"
                ? "user-row"
                : "bot-row");


        const message =
            document.createElement("div");


        message.className =
            "message " +
            (type === "user"
                ? "user-message"
                : "bot-message");


        message.textContent = text;


        if (type === "bot") {

            const avatar =
                document.createElement("div");

            avatar.className =
                "message-avatar";

            avatar.innerHTML =
                '<i class="fa-solid fa-robot"></i>';

            row.appendChild(avatar);

        }


        row.appendChild(message);


        chatMessages.appendChild(row);


        chatMessages.scrollTop =
            chatMessages.scrollHeight;


        if (save) {

            conversation.push({
                text: text,
                type: type,
                time: new Date().toISOString()
            });


            localStorage.setItem(
                "currentConversation",
                JSON.stringify(conversation)
            );

        }

    }



    // =================================================
    // LOAD CURRENT CHAT
    // =================================================

    function loadConversation() {

        if (conversation.length === 0) {
            return;
        }


        chatMessages.innerHTML = "";


        conversation.forEach(function (item) {

            addMessage(
                item.text,
                item.type,
                false
            );

        });

    }


    loadConversation();



    // =================================================
    // SEND CHAT MESSAGE
    // =================================================

    chatForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const message =
                chatInput.value.trim();


            if (!message) {
                return;
            }


            // Show user message

            addMessage(
                message,
                "user"
            );


            chatInput.value = "";


            sendBtn.disabled = true;


            chatStatus.textContent =
                "AI is thinking...";


            // Temporary typing message

            const typing =
                document.createElement("div");

            typing.className =
                "message-row bot-row";

            typing.id =
                "typingMessage";


            const typingAvatar =
                document.createElement("div");

            typingAvatar.className =
                "message-avatar";

            typingAvatar.innerHTML =
                '<i class="fa-solid fa-robot"></i>';


            const typingText =
                document.createElement("div");

            typingText.className =
                "message bot-message";

            typingText.textContent =
                "Thinking...";


            typing.appendChild(
                typingAvatar
            );

            typing.appendChild(
                typingText
            );


            chatMessages.appendChild(
                typing
            );


            chatMessages.scrollTop =
                chatMessages.scrollHeight;


            try {


                // =====================================
                // CALL FLASK BACKEND
                // =====================================

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/chat",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                message: message,

                                email:
                                    localStorage.getItem(
                                        "email"
                                    ),

                                username:
                                    localStorage.getItem(
                                        "username"
                                    )

                            })

                        }
                    );


                // Remove typing

                const typingMessage =
                    document.getElementById(
                        "typingMessage"
                    );


                if (typingMessage) {

                    typingMessage.remove();

                }


                // Read response

                const data =
                    await response.json();


                console.log(
                    "Backend response:",
                    data
                );


                // =====================================
                // SUCCESS
                // =====================================

                if (
                    response.ok &&
                    data.success
                ) {


                    const answer =
                        data.response ||
                        data.reply ||
                        data.message ||
                        data.answer;


                    if (answer) {

                        addMessage(
                            answer,
                            "bot"
                        );


                        // Add to history

                        history.push({

                            question:
                                message,

                            answer:
                                answer,

                            time:
                                new Date().toISOString()

                        });


                        localStorage.setItem(
                            "chatHistory",
                            JSON.stringify(history)
                        );

                    }

                    else {

                        addMessage(
                            "The AI returned an empty response.",
                            "bot"
                        );

                    }

                }

                else {

                    addMessage(

                        data.message ||
                        "Unable to get a response from the AI backend.",

                        "bot"

                    );

                }

            }

            catch (error) {

                console.error(
                    "CHAT ERROR:",
                    error
                );


                const typingMessage =
                    document.getElementById(
                        "typingMessage"
                    );


                if (typingMessage) {

                    typingMessage.remove();

                }


                addMessage(

                    "❌ Unable to connect to the AI backend. Please make sure Flask is running on port 5000.",

                    "bot"

                );

            }


            sendBtn.disabled = false;

            chatStatus.textContent = "";

            chatInput.focus();

        }
    );



    // =================================================
    // NEW CHAT
    // =================================================

    document
        .getElementById("newChatBtn")
        .addEventListener(
            "click",
            function () {

                conversation = [];

                localStorage.removeItem(
                    "currentConversation"
                );


                chatMessages.innerHTML = "";


                addMessage(

                    "👋 Hello! Welcome to Secure AI Assistant. How can I help you today?",

                    "bot",

                    false

                );


                showChat();

            }
        );



    // =================================================
    // CHAT BUTTON
    // =================================================

    document
        .getElementById("chatBtn")
        .addEventListener(
            "click",
            function () {

                showChat();

            }
        );



    // =================================================
    // HISTORY BUTTON
    // =================================================

    document
        .getElementById("historyBtn")
        .addEventListener(
            "click",
            function () {

                showHistory();

            }
        );



    // =================================================
    // FEATURE HISTORY CARD
    // =================================================

    document
        .getElementById("featureHistory")
        .addEventListener(
            "click",
            function () {

                showHistory();

            }
        );



    // =================================================
    // AI CHAT FEATURE
    // =================================================

    document
        .getElementById("featureChat")
        .addEventListener(
            "click",
            function () {

                showChat();

                chatInput.focus();

            }
        );



    // =================================================
    // SAVED CHATS BUTTON
    // =================================================

    document
        .getElementById("savedChatsBtn")
        .addEventListener(
            "click",
            function () {

                showSaved();

            }
        );



    // =================================================
    // FAVORITES BUTTON
    // =================================================

    document
        .getElementById("favoritesBtn")
        .addEventListener(
            "click",
            function () {

                showFavorites();

            }
        );



    // =================================================
    // SETTINGS BUTTON
    // =================================================

    document
        .getElementById("settingsBtn")
        .addEventListener(
            "click",
            function () {

                window.location.href =
                    "settings.html";

            }
        );



    // =================================================
    // SAVE CURRENT CHAT
    // =================================================

    document
        .getElementById("saveChatBtn")
        .addEventListener(
            "click",
            function () {

                if (
                    conversation.length === 0
                ) {

                    alert(
                        "There is no conversation to save."
                    );

                    return;

                }


                savedChats.push({

                    id:
                        Date.now(),

                    username:
                        username,

                    messages:
                        [...conversation],

                    time:
                        new Date().toISOString()

                });


                localStorage.setItem(
                    "savedChats",
                    JSON.stringify(savedChats)
                );


                alert(
                    "✅ Chat saved successfully!"
                );

            }
        );



    // =================================================
    // RENDER HISTORY
    // =================================================

    function renderHistory() {

        const list =
            document.getElementById(
                "historyList"
            );


        list.innerHTML = "";


        if (history.length === 0) {

            list.innerHTML = `

                <div class="empty-message">

                    <i class="fa-solid fa-clock-rotate-left"
                       style="font-size:35px;">
                    </i>

                    <p>
                        No chat history yet.
                    </p>

                </div>

            `;

            return;

        }


        [...history]
            .reverse()
            .forEach(
                function (item) {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "history-item";


                    div.innerHTML = `

                        <strong>
                            ${escapeHTML(
                                item.question
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                item.answer
                            )}
                        </p>

                        <small>
                            ${new Date(
                                item.time
                            ).toLocaleString()}
                        </small>

                    `;


                    list.appendChild(div);

                }
            );

    }



    // =================================================
    // CLEAR HISTORY
    // =================================================

    document
        .getElementById("clearHistoryBtn")
        .addEventListener(
            "click",
            function () {

                if (
                    !confirm(
                        "Clear all chat history?"
                    )
                ) {

                    return;

                }


                history = [];


                localStorage.removeItem(
                    "chatHistory"
                );


                renderHistory();

            }
        );



    // =================================================
    // RENDER SAVED CHATS
    // =================================================

    function renderSaved() {

        const list =
            document.getElementById(
                "savedList"
            );


        list.innerHTML = "";


        if (savedChats.length === 0) {

            list.innerHTML = `

                <div class="empty-message">

                    <i class="fa-solid fa-bookmark"
                       style="font-size:35px;">
                    </i>

                    <p>
                        No saved chats yet.
                    </p>

                </div>

            `;

            return;

        }


        [...savedChats]
            .reverse()
            .forEach(
                function (chat) {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "saved-item";


                    div.innerHTML = `

                        <strong>
                            Saved Conversation
                        </strong>

                        <p>
                            ${chat.messages.length}
                            messages
                        </p>

                        <small>
                            ${new Date(
                                chat.time
                            ).toLocaleString()}
                        </small>

                    `;


                    list.appendChild(div);

                }
            );

    }



    // =================================================
    // RENDER FAVORITES
    // =================================================

    function renderFavorites() {

        const list =
            document.getElementById(
                "favoritesList"
            );


        list.innerHTML = "";


        if (favorites.length === 0) {

            list.innerHTML = `

                <div class="empty-message">

                    <i class="fa-solid fa-star"
                       style="font-size:35px;">
                    </i>

                    <p>
                        No favorite messages yet.
                    </p>

                </div>

            `;

            return;

        }


        favorites.forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "favorite-item";


                div.textContent =
                    item;


                list.appendChild(div);

            }
        );

    }



    // =================================================
    // LOGOUT
    // =================================================

    document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            function () {

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
                    "currentConversation"
                );


                window.location.href =
                    "login.html";

            }
        );



    // =================================================
    // MOBILE MENU
    // =================================================

    document
        .getElementById("menuBtn")
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById("sidebar")
                    .classList.toggle("open");

            }
        );



    // =================================================
    // ESCAPE HTML
    // =================================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value || "";

        return div.innerHTML;

    }

});