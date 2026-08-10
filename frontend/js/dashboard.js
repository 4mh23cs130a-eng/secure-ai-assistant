/* =====================================================
   SECURE AI ASSISTANT
   DASHBOARD JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const chatMessages =
    document.getElementById("chatMessages");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const saveChatBtn =
    document.getElementById("saveChatBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const sidebar =
    document.getElementById("sidebar");

const menuBtn =
    document.getElementById("menuBtn");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


/* =====================================================
   USER INFORMATION
===================================================== */

const username =
    localStorage.getItem("username") || "User";

const email =
    localStorage.getItem("email") || "";


document.getElementById(
    "sidebarUsername"
).textContent = username;


document.getElementById(
    "topUsername"
).textContent = username;


document.getElementById(
    "welcomeUsername"
).textContent = username;


document.getElementById(
    "settingsEmail"
).textContent =
    email || "Not available";


/* =====================================================
   CONVERSATION
===================================================== */

let conversation = [];


/* =====================================================
   LOCAL STORAGE KEYS
===================================================== */

const HISTORY_KEY =
    "secureAI_history";

const SAVED_KEY =
    "secureAI_saved";

const FAVORITES_KEY =
    "secureAI_favorites";


/* =====================================================
   GET LOCAL DATA
===================================================== */

function getData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    }

    catch {

        return [];

    }

}


function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* =====================================================
   MARKDOWN
===================================================== */

marked.setOptions({

    breaks: true,

    gfm: true

});


/* =====================================================
   INITIAL MESSAGE
===================================================== */

function showWelcomeMessage() {

    chatMessages.innerHTML = "";

    conversation = [];

    addMessage(
        "👋 Hello! Welcome to **Secure AI Assistant**. How can I help you today?",
        "bot",
        false
    );

}


showWelcomeMessage();


/* =====================================================
   ADD MESSAGE
===================================================== */

function addMessage(
    text,
    type,
    save = true
) {


    const row =
        document.createElement("div");


    row.className =
        "message-row " +
        (
            type === "user"
                ? "user-row"
                : "bot-row"
        );


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "message-wrapper";


    const message =
        document.createElement("div");


    message.className =
        "message " +
        (
            type === "user"
                ? "user-message"
                : "bot-message"
        );


    /* ==============================================
       USER
    ============================================== */

    if (type === "user") {

        message.textContent = text;

    }


    /* ==============================================
       AI
    ============================================== */

    else {

        const html =
            marked.parse(text);

        message.innerHTML =
            DOMPurify.sanitize(html);

    }


    wrapper.appendChild(message);


    /* ==============================================
       COPY BUTTON
    ============================================== */

    if (type === "bot") {

        const copyBtn =
            document.createElement("button");


        copyBtn.className =
            "copy-btn";


        copyBtn.innerHTML =
            '<i class="fa-regular fa-copy"></i> Copy';


        copyBtn.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard
                        .writeText(text);

                    copyBtn.innerHTML =
                        '<i class="fa-solid fa-check"></i> Copied';

                    setTimeout(() => {

                        copyBtn.innerHTML =
                            '<i class="fa-regular fa-copy"></i> Copy';

                    }, 1500);

                }

                catch {

                    copyBtn.textContent =
                        "Copy failed";

                }

            }
        );


        wrapper.appendChild(copyBtn);

    }


    /* ==============================================
       AI AVATAR
    ============================================== */

    if (type === "bot") {

        const avatar =
            document.createElement("div");


        avatar.className =
            "message-avatar";


        avatar.innerHTML =
            '<i class="fa-solid fa-robot"></i>';


        row.appendChild(avatar);

    }


    row.appendChild(wrapper);


    chatMessages.appendChild(row);


    /* ==============================================
       SAVE CURRENT CONVERSATION
    ============================================== */

    if (save) {

        conversation.push({

            text: text,

            type: type,

            time:
                new Date().toISOString()

        });


        localStorage.setItem(

            "currentConversation",

            JSON.stringify(
                conversation
            )

        );

    }


    /* ==============================================
       SCROLL
    ============================================== */

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =====================================================
   TYPING INDICATOR
===================================================== */

function showTyping() {


    const row =
        document.createElement("div");


    row.className =
        "message-row bot-row";


    row.id =
        "typingMessage";


    const avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";


    avatar.innerHTML =
        '<i class="fa-solid fa-robot"></i>';


    const message =
        document.createElement("div");


    message.className =
        "message bot-message";


    message.innerHTML = `

        <div class="typing">

            <span></span>

            <span></span>

            <span></span>

        </div>

    `;


    row.appendChild(avatar);

    row.appendChild(message);

    chatMessages.appendChild(row);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =====================================================
   REMOVE TYPING
===================================================== */

function removeTyping() {

    const typing =
        document.getElementById(
            "typingMessage"
        );


    if (typing) {

        typing.remove();

    }

}


/* =====================================================
   SEND MESSAGE
===================================================== */

async function sendMessage() {


    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    /* ==============================================
       SHOW USER MESSAGE
    ============================================== */

    addMessage(
        text,
        "user",
        true
    );


    messageInput.value = "";

    messageInput.style.height =
        "50px";


    sendBtn.disabled =
        true;


    showTyping();


    try {


        const token =
            localStorage.getItem(
                "token"
            );


        const headers = {

            "Content-Type":
                "application/json"

        };


        if (token) {

            headers[
                "Authorization"
            ] =
                "Bearer " + token;

        }


        /* ==========================================
           CALL FLASK BACKEND
        ========================================== */

        const response =
            await fetch(
                "http://127.0.0.1:5000/chat",
                {

                    method: "POST",

                    headers: headers,

                    body: JSON.stringify({

                        message: text

                    })

                }
            );


        const data =
            await response.json();


        removeTyping();


        /* ==========================================
           RESPONSE
        ========================================== */

        if (
            data.success === false
        ) {

            addMessage(

                data.message ||
                "Something went wrong.",

                "bot",

                true

            );

            return;

        }


        const answer =
            data.response ||
            data.message ||
            data.reply ||
            data.answer ||
            data.result;


        if (!answer) {

            addMessage(

                "I received a response from the server, but no answer was returned.",

                "bot",

                true

            );

            return;

        }


        addMessage(

            answer,

            "bot",

            true

        );


    }

    catch (error) {

        console.error(
            "Chat error:",
            error
        );


        removeTyping();


        addMessage(

            "⚠️ **Unable to connect to the AI backend.**\n\nPlease make sure your Flask server is running on `http://127.0.0.1:5000`.",

            "bot",

            true

        );

    }


    finally {

        sendBtn.disabled =
            false;

        messageInput.focus();

    }

}


/* =====================================================
   SEND BUTTON
===================================================== */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =====================================================
   ENTER KEY
===================================================== */

messageInput.addEventListener(
    "keydown",
    (event) => {


        const enterEnabled =
            document.getElementById(
                "enterToSend"
            ).checked;


        if (

            event.key === "Enter" &&

            !event.shiftKey &&

            enterEnabled

        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =====================================================
   AUTO RESIZE TEXTAREA
===================================================== */

messageInput.addEventListener(
    "input",
    () => {

        messageInput.style.height =
            "auto";


        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                150
            ) + "px";

    }
);


/* =====================================================
   NEW CHAT
===================================================== */

document
    .getElementById("newChatBtn")
    .addEventListener(
        "click",
        () => {

            conversation = [];

            localStorage.removeItem(
                "currentConversation"
            );

            showWelcomeMessage();

            showView("chat");

            closeSidebar();

        }
    );


/* =====================================================
   CHAT BUTTON
===================================================== */

document
    .getElementById("chatBtn")
    .addEventListener(
        "click",
        () => {

            showView("chat");

            closeSidebar();

        }
    );


/* =====================================================
   FEATURE CARD
===================================================== */

document
    .getElementById("aiChatCard")
    .addEventListener(
        "click",
        () => {

            showView("chat");

        }
    );


/* =====================================================
   HISTORY BUTTON
===================================================== */

document
    .getElementById("historyBtn")
    .addEventListener(
        "click",
        () => {

            renderHistory();

            showView("history");

            closeSidebar();

        }
    );


document
    .getElementById("historyCard")
    .addEventListener(
        "click",
        () => {

            renderHistory();

            showView("history");

        }
    );


/* =====================================================
   SAVED CHATS
===================================================== */

document
    .getElementById("savedChatsBtn")
    .addEventListener(
        "click",
        () => {

            renderSaved();

            showView("saved");

            closeSidebar();

        }
    );


/* =====================================================
   FAVORITES
===================================================== */

document
    .getElementById("favoritesBtn")
    .addEventListener(
        "click",
        () => {

            renderFavorites();

            showView("favorites");

            closeSidebar();

        }
    );


/* =====================================================
   SETTINGS
===================================================== */

document
    .getElementById("settingsBtn")
    .addEventListener(
        "click",
        () => {

            showView("settings");

            closeSidebar();

        }
    );


/* =====================================================
   SHOW VIEW
===================================================== */

/* =====================================================
   SHOW ONLY ONE VIEW AT A TIME
===================================================== */

function showView(view) {

    const dashboard =
        document.getElementById("dashboardView");

    const history =
        document.getElementById("historyView");

    const saved =
        document.getElementById("savedView");

    const favorites =
        document.getElementById("favoritesView");

    const settings =
        document.getElementById("settingsView");


    /* ---------------------------------------------
       HIDE ALL VIEWS FIRST
    --------------------------------------------- */

    dashboard.style.display = "none";
    history.style.display = "none";
    saved.style.display = "none";
    favorites.style.display = "none";
    settings.style.display = "none";


    /* Remove active class from sidebar */

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.remove("active");

        });


    /* ---------------------------------------------
       CHAT
    --------------------------------------------- */

    if (view === "chat") {

        dashboard.style.display = "block";

        document
            .getElementById("chatBtn")
            .classList.add("active");

        document.getElementById(
            "pageTitle"
        ).textContent = "AI Assistant";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Ask anything and get intelligent answers";

    }


    /* ---------------------------------------------
       CHAT HISTORY
    --------------------------------------------- */

    else if (view === "history") {

        history.style.display = "block";

        document
            .getElementById("historyBtn")
            .classList.add("active");

        document.getElementById(
            "pageTitle"
        ).textContent = "Chat History";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "View and manage your previous conversations";

        renderHistory();

    }


    /* ---------------------------------------------
       SAVED CHATS
    --------------------------------------------- */

    else if (view === "saved") {

        saved.style.display = "block";

        document
            .getElementById("savedChatsBtn")
            .classList.add("active");

        document.getElementById(
            "pageTitle"
        ).textContent = "Saved Chats";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Your saved conversations";

        renderSaved();

    }


    /* ---------------------------------------------
       FAVORITES
    --------------------------------------------- */

    else if (view === "favorites") {

        favorites.style.display = "block";

        document
            .getElementById("favoritesBtn")
            .classList.add("active");

        document.getElementById(
            "pageTitle"
        ).textContent = "Favorites";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Your favorite conversations";

        renderFavorites();

    }


    /* ---------------------------------------------
       SETTINGS
    --------------------------------------------- */

    else if (view === "settings") {

        settings.style.display = "block";

        document
            .getElementById("settingsBtn")
            .classList.add("active");

        document.getElementById(
            "pageTitle"
        ).textContent = "Settings";

        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Manage your account preferences";

    }

}
/* =====================================================
   SAVE CHAT
===================================================== */

saveChatBtn.addEventListener(
    "click",
    saveCurrentChat
);


function saveCurrentChat() {


    if (
        conversation.length === 0
    ) {

        alert(
            "There is no conversation to save."
        );

        return;

    }


    const saved =
        getData(SAVED_KEY);


    const chat = {

        id: Date.now(),

        title:
            getChatTitle(),

        messages:
            [...conversation],

        createdAt:
            new Date().toISOString(),

        favorite:
            false

    };


    saved.unshift(chat);


    saveData(
        SAVED_KEY,
        saved
    );


    alert(
        "Chat saved successfully!"
    );

}


/* =====================================================
   CHAT TITLE
===================================================== */

function getChatTitle() {


    const firstUserMessage =
        conversation.find(
            item =>
                item.type === "user"
        );


    if (
        !firstUserMessage
    ) {

        return "New Conversation";

    }


    return firstUserMessage.text
        .substring(0, 60);

}


/* =====================================================
   SAVE HISTORY
===================================================== */

function saveToHistory() {


    if (
        conversation.length === 0
    ) {

        return;

    }


    const history =
        getData(HISTORY_KEY);


    const chat = {

        id: Date.now(),

        title:
            getChatTitle(),

        messages:
            [...conversation],

        createdAt:
            new Date().toISOString()

    };


    history.unshift(chat);


    saveData(
        HISTORY_KEY,
        history.slice(0, 50)
    );

}


/* =====================================================
   HISTORY
===================================================== */

function renderHistory() {


    const list =
        document.getElementById(
            "historyList"
        );


    const history =
        getData(HISTORY_KEY);


    if (
        history.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-clock-rotate-left"></i>

                <h3>No chat history</h3>

                <p>
                    Your conversations will appear here.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    history.forEach(chat => {

        list.appendChild(
            createConversationCard(
                chat,
                "history"
            )
        );

    });

}


/* =====================================================
   SAVED
===================================================== */

function renderSaved() {


    const list =
        document.getElementById(
            "savedList"
        );


    const saved =
        getData(SAVED_KEY);


    if (
        saved.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-bookmark"></i>

                <h3>No saved chats</h3>

                <p>
                    Save a conversation to see it here.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    saved.forEach(chat => {

        list.appendChild(
            createConversationCard(
                chat,
                "saved"
            )
        );

    });

}


/* =====================================================
   FAVORITES
===================================================== */

function renderFavorites() {


    const list =
        document.getElementById(
            "favoritesList"
        );


    const saved =
        getData(SAVED_KEY);


    const favorites =
        saved.filter(
            chat => chat.favorite
        );


    if (
        favorites.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-star"></i>

                <h3>No favorites</h3>

                <p>
                    Mark saved conversations as favorites.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    favorites.forEach(chat => {

        list.appendChild(
            createConversationCard(
                chat,
                "favorite"
            )
        );

    });

}


/* =====================================================
   CONVERSATION CARD
===================================================== */

function createConversationCard(
    chat,
    type
) {


    const card =
        document.createElement("div");


    card.className =
        "conversation-card";


    const info =
        document.createElement("div");


    info.className =
        "conversation-info";


    const title =
        document.createElement("h3");


    title.textContent =
        chat.title;


    const date =
        document.createElement("p");


    date.textContent =
        new Date(
            chat.createdAt
        ).toLocaleString();


    info.appendChild(title);

    info.appendChild(date);


    const actions =
        document.createElement("div");


    actions.className =
        "conversation-actions";


    /* Open */

    const openBtn =
        document.createElement("button");


    openBtn.className =
        "small-btn";


    openBtn.innerHTML =
        '<i class="fa-solid fa-folder-open"></i>';


    openBtn.title =
        "Open Chat";


    openBtn.addEventListener(
        "click",
        () => {

            loadConversation(
                chat
            );

            showView("chat");

        }
    );


    actions.appendChild(
        openBtn
    );


    /* Favorite */

    if (
        type === "saved" ||
        type === "favorite"
    ) {

        const favoriteBtn =
            document.createElement("button");


        favoriteBtn.className =
            "small-btn";


        favoriteBtn.innerHTML =
            chat.favorite

                ? '<i class="fa-solid fa-star"></i>'

                : '<i class="fa-regular fa-star"></i>';


        favoriteBtn.title =
            "Favorite";


        favoriteBtn.addEventListener(
            "click",
            () => {

                toggleFavorite(
                    chat.id
                );

            }
        );


        actions.appendChild(
            favoriteBtn
        );

    }


    /* Delete */

    const deleteBtn =
        document.createElement("button");


    deleteBtn.className =
        "small-btn";


    deleteBtn.innerHTML =
        '<i class="fa-solid fa-trash"></i>';


    deleteBtn.title =
        "Delete";


    deleteBtn.addEventListener(
        "click",
        () => {

            deleteConversation(
                chat.id,
                type
            );

        }
    );


    actions.appendChild(
        deleteBtn
    );


    card.appendChild(info);

    card.appendChild(actions);


    return card;

}


/* =====================================================
   LOAD CONVERSATION
===================================================== */

function loadConversation(
    chat
) {


    conversation =
        [...chat.messages];


    chatMessages.innerHTML =
        "";


    conversation.forEach(
        item => {

            addMessage(
                item.text,
                item.type,
                false
            );

        }
    );


    localStorage.setItem(

        "currentConversation",

        JSON.stringify(
            conversation
        )

    );

}


/* =====================================================
   FAVORITE
===================================================== */

function toggleFavorite(
    id
) {


    const saved =
        getData(SAVED_KEY);


    const chat =
        saved.find(
            item => item.id === id
        );


    if (!chat) {

        return;

    }


    chat.favorite =
        !chat.favorite;


    saveData(
        SAVED_KEY,
        saved
    );


    renderSaved();

    renderFavorites();

}


/* =====================================================
   DELETE CONVERSATION
===================================================== */

function deleteConversation(
    id,
    type
) {


    if (
        !confirm(
            "Delete this conversation?"
        )
    ) {

        return;

    }


    if (
        type === "saved" ||
        type === "favorite"
    ) {

        let saved =
            getData(SAVED_KEY);


        saved =
            saved.filter(
                chat =>
                    chat.id !== id
            );


        saveData(
            SAVED_KEY,
            saved
        );


        renderSaved();

        renderFavorites();

    }


    else {

        let history =
            getData(HISTORY_KEY);


        history =
            history.filter(
                chat =>
                    chat.id !== id
            );


        saveData(
            HISTORY_KEY,
            history
        );


        renderHistory();

    }

}


/* =====================================================
   CLEAR HISTORY
===================================================== */

document
    .getElementById(
        "clearHistoryBtn"
    )
    .addEventListener(
        "click",
        () => {


            if (
                !confirm(
                    "Clear all chat history?"
                )
            ) {

                return;

            }


            localStorage.removeItem(
                HISTORY_KEY
            );


            renderHistory();

        }
    );


/* =====================================================
   MOBILE MENU
===================================================== */

menuBtn.addEventListener(
    "click",
    () => {

        sidebar.classList.add(
            "open"
        );

        sidebarOverlay.classList.add(
            "show"
        );

    }
);


sidebarOverlay.addEventListener(
    "click",
    closeSidebar
);


function closeSidebar() {

    sidebar.classList.remove(
        "open"
    );

    sidebarOverlay.classList.remove(
        "show"
    );

}


/* =====================================================
   LOGOUT
===================================================== */

logoutBtn.addEventListener(
    "click",
    () => {


        if (
            !confirm(
                "Are you sure you want to logout?"
            )
        ) {

            return;

        }


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


/* =====================================================
   THEME
===================================================== */

const themeSelect =
    document.getElementById(
        "themeSelect"
    );


const savedTheme =
    localStorage.getItem(
        "dashboardTheme"
    );


if (
    savedTheme === "dark"
) {

    document.body.classList.add(
        "dark"
    );

    themeSelect.value =
        "dark";

}


themeSelect.addEventListener(
    "change",
    () => {


        if (
            themeSelect.value === "dark"
        ) {

            document.body.classList.add(
                "dark"
            );

            localStorage.setItem(
                "dashboardTheme",
                "dark"
            );

        }

        else {

            document.body.classList.remove(
                "dark"
            );

            localStorage.setItem(
                "dashboardTheme",
                "light"
            );

        }

    }
);


/* =====================================================
   ENTER TO SEND
===================================================== */

const enterToSend =
    document.getElementById(
        "enterToSend"
    );


const savedEnterSetting =
    localStorage.getItem(
        "enterToSend"
    );


if (
    savedEnterSetting === "false"
) {

    enterToSend.checked =
        false;

}


enterToSend.addEventListener(
    "change",
    () => {

        localStorage.setItem(

            "enterToSend",

            enterToSend.checked

        );

    }
);


/* =====================================================
   DELETE LOCAL DATA
===================================================== */

document
    .getElementById(
        "deleteLocalDataBtn"
    )
    .addEventListener(
        "click",
        () => {


            if (
                !confirm(
                    "Delete saved chats, favorites and history?"
                )
            ) {

                return;

            }


            localStorage.removeItem(
                HISTORY_KEY
            );


            localStorage.removeItem(
                SAVED_KEY
            );


            localStorage.removeItem(
                FAVORITES_KEY
            );


            alert(
                "Local chat data deleted."
            );

        }
    );


/* =====================================================
   SAVE CURRENT CHAT TO HISTORY
===================================================== */

window.addEventListener(
    "beforeunload",
    () => {

        if (
            conversation.length > 1
        ) {

            saveToHistory();

        }

    }
);


/* =====================================================
   RESTORE CURRENT CONVERSATION
===================================================== */

function restoreConversation() {


    const stored =
        localStorage.getItem(
            "currentConversation"
        );


    if (!stored) {

        return;

    }


    try {

        const messages =
            JSON.parse(stored);


        if (
            !Array.isArray(messages) ||
            messages.length === 0
        ) {

            return;

        }


        conversation =
            messages;


        chatMessages.innerHTML =
            "";


        messages.forEach(
            item => {

                addMessage(
                    item.text,
                    item.type,
                    false
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Restore error:",
            error
        );

    }

}


/* =====================================================
   INITIALIZE
===================================================== */

restoreConversation();
