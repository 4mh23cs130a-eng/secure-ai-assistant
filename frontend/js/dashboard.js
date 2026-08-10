/* =====================================================
   SECURE AI ASSISTANT
   DASHBOARD JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const saveChatBtn = document.getElementById("saveChatBtn");
const logoutBtn = document.getElementById("logoutBtn");

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");


/* =====================================================
   SAFE ELEMENT HELPER
===================================================== */

function getElement(id) {
    return document.getElementById(id);
}


/* =====================================================
   USER INFORMATION
===================================================== */

/*
   We check multiple possible storage formats.

   Priority:
   1. username
   2. name
   3. user object
   4. currentUser object
   5. loggedInUser object
   6. email username
   7. User
*/

function getLoggedInUser() {

    let username = "";
    let email = "";


    /* ---------------------------------------------
       Direct username
    --------------------------------------------- */

    username =
        localStorage.getItem("username") ||
        localStorage.getItem("name") ||
        "";


    /* ---------------------------------------------
       Direct email
    --------------------------------------------- */

    email =
        localStorage.getItem("email") ||
        "";


    /* ---------------------------------------------
       Check user object
    --------------------------------------------- */

    const possibleUserKeys = [
        "user",
        "currentUser",
        "loggedInUser"
    ];


    for (const key of possibleUserKeys) {

        const storedUser =
            localStorage.getItem(key);

        if (!storedUser) {
            continue;
        }


        try {

            const userObject =
                JSON.parse(storedUser);


            if (
                typeof userObject === "object" &&
                userObject !== null
            ) {

                username =
                    username ||
                    userObject.username ||
                    userObject.name ||
                    userObject.fullName ||
                    userObject.displayName ||
                    "";


                email =
                    email ||
                    userObject.email ||
                    "";

            }

        }

        catch {

            /*
               If the stored value is just a
               plain username, use it.
            */

            if (!username) {
                username = storedUser;
            }

        }

    }


    /* ---------------------------------------------
       Check loginUser
    --------------------------------------------- */

    const loginUser =
        localStorage.getItem("loginUser");


    if (loginUser) {

        try {

            const userObject =
                JSON.parse(loginUser);


            if (
                typeof userObject === "object" &&
                userObject !== null
            ) {

                username =
                    username ||
                    userObject.username ||
                    userObject.name ||
                    userObject.fullName ||
                    userObject.displayName ||
                    "";


                email =
                    email ||
                    userObject.email ||
                    "";

            }

        }

        catch {

            if (!username) {
                username = loginUser;
            }

        }

    }


    /* ---------------------------------------------
       If username is still empty,
       use email before @
    --------------------------------------------- */

    if (
        !username &&
        email
    ) {

        username =
            email.split("@")[0];

    }


    /* ---------------------------------------------
       Final fallback
    --------------------------------------------- */

    if (!username) {
        username = "User";
    }


    return {
        username: username,
        email: email
    };

}


const loggedInUser =
    getLoggedInUser();


const username =
    loggedInUser.username;


const email =
    loggedInUser.email;


/* =====================================================
   DISPLAY USERNAME EVERYWHERE
===================================================== */

function displayUserInformation() {

    const sidebarUsername =
        getElement("sidebarUsername");

    const topUsername =
        getElement("topUsername");

    const welcomeUsername =
        getElement("welcomeUsername");

    const settingsEmail =
        getElement("settingsEmail");


    if (sidebarUsername) {

        sidebarUsername.textContent =
            username;

    }


    if (topUsername) {

        topUsername.textContent =
            username;

    }


    if (welcomeUsername) {

        welcomeUsername.textContent =
            username;

    }


    if (settingsEmail) {

        settingsEmail.textContent =
            email || "Not available";

    }

}


displayUserInformation();


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
   LOCAL STORAGE HELPERS
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

if (
    typeof marked !== "undefined"
) {

    marked.setOptions({

        breaks: true,

        gfm: true

    });

}


/* =====================================================
   INITIAL MESSAGE
===================================================== */

function showWelcomeMessage() {

    if (!chatMessages) {
        return;
    }


    chatMessages.innerHTML = "";

    conversation = [];


    addMessage(

        "👋 Hello! Welcome to **Secure AI Assistant**. How can I help you today?",

        "bot",

        false

    );

}


/* =====================================================
   ADD MESSAGE
===================================================== */

function addMessage(
    text,
    type,
    save = true
) {

    if (!chatMessages) {
        return;
    }


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


    /* ---------------------------------------------
       USER MESSAGE
    --------------------------------------------- */

    if (
        type === "user"
    ) {

        message.textContent =
            text;

    }


    /* ---------------------------------------------
       AI MESSAGE
    --------------------------------------------- */

    else {

        let html = "";


        if (
            typeof marked !== "undefined"
        ) {

            html =
                marked.parse(
                    String(text)
                );

        }

        else {

            /*
               Fallback if marked is not loaded
            */

            html =
                String(text)
                    .replace(
                        /\n/g,
                        "<br>"
                    );

        }


        if (
            typeof DOMPurify !== "undefined"
        ) {

            message.innerHTML =
                DOMPurify.sanitize(html);

        }

        else {

            message.textContent =
                text;

        }

    }


    wrapper.appendChild(message);


    /* =================================================
       COPY BUTTON
    ================================================= */

    if (
        type === "bot"
    ) {

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
                        .writeText(
                            String(text)
                        );


                    copyBtn.innerHTML =
                        '<i class="fa-solid fa-check"></i> Copied';


                    setTimeout(
                        () => {

                            copyBtn.innerHTML =
                                '<i class="fa-regular fa-copy"></i> Copy';

                        },
                        1500
                    );

                }

                catch {

                    copyBtn.textContent =
                        "Copy failed";

                }

            }
        );


        wrapper.appendChild(
            copyBtn
        );

    }


    /* =================================================
       AI AVATAR
    ================================================= */

    if (
        type === "bot"
    ) {

        const avatar =
            document.createElement("div");


        avatar.className =
            "message-avatar";


        avatar.innerHTML =
            '<i class="fa-solid fa-robot"></i>';


        row.appendChild(
            avatar
        );

    }


    row.appendChild(
        wrapper
    );


    chatMessages.appendChild(
        row
    );


    /* =================================================
       SAVE CURRENT CONVERSATION
    ================================================= */

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


    /* =================================================
       SCROLL
    ================================================= */

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =====================================================
   TYPING INDICATOR
===================================================== */

function showTyping() {

    if (!chatMessages) {
        return;
    }


    removeTyping();


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


    row.appendChild(
        avatar
    );


    row.appendChild(
        message
    );


    chatMessages.appendChild(
        row
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =====================================================
   REMOVE TYPING
===================================================== */

function removeTyping() {

    const typing =
        getElement(
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

    if (
        !messageInput ||
        !sendBtn
    ) {

        return;

    }


    const text =
        messageInput.value.trim();


    if (!text) {
        return;
    }


    /* ---------------------------------------------
       SHOW USER MESSAGE
    --------------------------------------------- */

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

        /* -----------------------------------------
           TOKEN
        ----------------------------------------- */

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


        /* -----------------------------------------
           CALL FLASK BACKEND
        ----------------------------------------- */

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


        /* -----------------------------------------
           BACKEND ERROR
        ----------------------------------------- */

        if (
            data.success === false
        ) {

            addMessage(

                data.error ||
                data.message ||
                "Something went wrong.",

                "bot",

                true

            );

            return;

        }


        /* -----------------------------------------
           FIND RESPONSE
        ----------------------------------------- */

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


        /* -----------------------------------------
           SHOW AI RESPONSE
        ----------------------------------------- */

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

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        sendMessage
    );

}


/* =====================================================
   ENTER KEY
===================================================== */

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        (event) => {

            const enterCheckbox =
                getElement(
                    "enterToSend"
                );


            const enterEnabled =
                !enterCheckbox ||
                enterCheckbox.checked;


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

}


/* =====================================================
   AUTO RESIZE TEXTAREA
===================================================== */

if (messageInput) {

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

}


/* =====================================================
   NEW CHAT
===================================================== */

const newChatBtn =
    getElement("newChatBtn");


if (newChatBtn) {

    newChatBtn.addEventListener(
        "click",
        () => {

            conversation = [];


            localStorage.removeItem(
                "currentConversation"
            );


            showWelcomeMessage();


            showView(
                "chat"
            );


            closeSidebar();

        }
    );

}


/* =====================================================
   CHAT BUTTON
===================================================== */

const chatBtn =
    getElement("chatBtn");


if (chatBtn) {

    chatBtn.addEventListener(
        "click",
        () => {

            showView(
                "chat"
            );


            closeSidebar();

        }
    );

}


/* =====================================================
   AI CHAT CARD
===================================================== */

const aiChatCard =
    getElement("aiChatCard");


if (aiChatCard) {

    aiChatCard.addEventListener(
        "click",
        () => {

            showView(
                "chat"
            );

        }
    );

}


/* =====================================================
   HISTORY BUTTON
===================================================== */

const historyBtn =
    getElement("historyBtn");


if (historyBtn) {

    historyBtn.addEventListener(
        "click",
        () => {

            renderHistory();

            showView(
                "history"
            );

            closeSidebar();

        }
    );

}


/* =====================================================
   HISTORY CARD
===================================================== */

const historyCard =
    getElement("historyCard");


if (historyCard) {

    historyCard.addEventListener(
        "click",
        () => {

            renderHistory();

            showView(
                "history"
            );

        }
    );

}


/* =====================================================
   SAVED CHATS
===================================================== */

const savedChatsBtn =
    getElement(
        "savedChatsBtn"
    );


if (savedChatsBtn) {

    savedChatsBtn.addEventListener(
        "click",
        () => {

            renderSaved();

            showView(
                "saved"
            );

            closeSidebar();

        }
    );

}


/* =====================================================
   FAVORITES
===================================================== */

const favoritesBtn =
    getElement(
        "favoritesBtn"
    );


if (favoritesBtn) {

    favoritesBtn.addEventListener(
        "click",
        () => {

            renderFavorites();

            showView(
                "favorites"
            );

            closeSidebar();

        }
    );

}


/* =====================================================
   SETTINGS
===================================================== */

const settingsBtn =
    getElement(
        "settingsBtn"
    );


if (settingsBtn) {

    settingsBtn.addEventListener(
        "click",
        () => {

            showView(
                "settings"
            );

            closeSidebar();

        }
    );

}


/* =====================================================
   SHOW VIEW
===================================================== */

function showView(view) {

    const dashboard =
        getElement(
            "dashboardView"
        );

    const history =
        getElement(
            "historyView"
        );

    const saved =
        getElement(
            "savedView"
        );

    const favorites =
        getElement(
            "favoritesView"
        );

    const settings =
        getElement(
            "settingsView"
        );


    /* ---------------------------------------------
       Hide all
    --------------------------------------------- */

    if (dashboard) {
        dashboard.style.display =
            "none";
    }


    if (history) {
        history.style.display =
            "none";
    }


    if (saved) {
        saved.style.display =
            "none";
    }


    if (favorites) {
        favorites.style.display =
            "none";
    }


    if (settings) {
        settings.style.display =
            "none";
    }


    /* ---------------------------------------------
       Remove active
    --------------------------------------------- */

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    const pageTitle =
        getElement(
            "pageTitle"
        );

    const pageSubtitle =
        getElement(
            "pageSubtitle"
        );


    /* =================================================
       CHAT
    ================================================= */

    if (
        view === "chat"
    ) {

        if (dashboard) {

            dashboard.style.display =
                "block";

        }


        if (chatBtn) {

            chatBtn.classList.add(
                "active"
            );

        }


        if (pageTitle) {

            pageTitle.textContent =
                "AI Assistant";

        }


        if (pageSubtitle) {

            pageSubtitle.textContent =
                "Ask anything and get intelligent answers";

        }

    }


    /* =================================================
       HISTORY
    ================================================= */

    else if (
        view === "history"
    ) {

        if (history) {

            history.style.display =
                "block";

        }


        if (historyBtn) {

            historyBtn.classList.add(
                "active"
            );

        }


        if (pageTitle) {

            pageTitle.textContent =
                "Chat History";

        }


        if (pageSubtitle) {

            pageSubtitle.textContent =
                "View and manage your previous conversations";

        }


        renderHistory();

    }


    /* =================================================
       SAVED
    ================================================= */

    else if (
        view === "saved"
    ) {

        if (saved) {

            saved.style.display =
                "block";

        }


        if (savedChatsBtn) {

            savedChatsBtn.classList.add(
                "active"
            );

        }


        if (pageTitle) {

            pageTitle.textContent =
                "Saved Chats";

        }


        if (pageSubtitle) {

            pageSubtitle.textContent =
                "Your saved conversations";

        }


        renderSaved();

    }


    /* =================================================
       FAVORITES
    ================================================= */

    else if (
        view === "favorites"
    ) {

        if (favorites) {

            favorites.style.display =
                "block";

        }


        if (favoritesBtn) {

            favoritesBtn.classList.add(
                "active"
            );

        }


        if (pageTitle) {

            pageTitle.textContent =
                "Favorites";

        }


        if (pageSubtitle) {

            pageSubtitle.textContent =
                "Your favorite conversations";

        }


        renderFavorites();

    }


    /* =================================================
       SETTINGS
    ================================================= */

    else if (
        view === "settings"
    ) {

        if (settings) {

            settings.style.display =
                "block";

        }


        if (settingsBtn) {

            settingsBtn.classList.add(
                "active"
            );

        }


        if (pageTitle) {

            pageTitle.textContent =
                "Settings";

        }


        if (pageSubtitle) {

            pageSubtitle.textContent =
                "Manage your account preferences";

        }

    }

}


/* =====================================================
   SAVE CHAT
===================================================== */

if (saveChatBtn) {

    saveChatBtn.addEventListener(
        "click",
        saveCurrentChat
    );

}


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
        getData(
            SAVED_KEY
        );


    const chat = {

        id:
            Date.now(),

        title:
            getChatTitle(),

        messages:
            [...conversation],

        createdAt:
            new Date().toISOString(),

        favorite:
            false

    };


    saved.unshift(
        chat
    );


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
        .substring(
            0,
            60
        );

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
        getData(
            HISTORY_KEY
        );


    const chat = {

        id:
            Date.now(),

        title:
            getChatTitle(),

        messages:
            [...conversation],

        createdAt:
            new Date().toISOString()

    };


    history.unshift(
        chat
    );


    saveData(

        HISTORY_KEY,

        history.slice(
            0,
            50
        )

    );

}


/* =====================================================
   RENDER HISTORY
===================================================== */

function renderHistory() {

    const list =
        getElement(
            "historyList"
        );


    if (!list) {
        return;
    }


    const history =
        getData(
            HISTORY_KEY
        );


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


    list.innerHTML =
        "";


    history.forEach(
        chat => {

            list.appendChild(

                createConversationCard(
                    chat,
                    "history"
                )

            );

        }
    );

}


/* =====================================================
   RENDER SAVED
===================================================== */

function renderSaved() {

    const list =
        getElement(
            "savedList"
        );


    if (!list) {
        return;
    }


    const saved =
        getData(
            SAVED_KEY
        );


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


    list.innerHTML =
        "";


    saved.forEach(
        chat => {

            list.appendChild(

                createConversationCard(
                    chat,
                    "saved"
                )

            );

        }
    );

}


/* =====================================================
   RENDER FAVORITES
===================================================== */

function renderFavorites() {

    const list =
        getElement(
            "favoritesList"
        );


    if (!list) {
        return;
    }


    const saved =
        getData(
            SAVED_KEY
        );


    const favorites =
        saved.filter(
            chat =>
                chat.favorite
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


    list.innerHTML =
        "";


    favorites.forEach(
        chat => {

            list.appendChild(

                createConversationCard(
                    chat,
                    "favorite"
                )

            );

        }
    );

}


/* =====================================================
   CONVERSATION CARD
===================================================== */

function createConversationCard(
    chat,
    type
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "conversation-card";


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "conversation-info";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        chat.title;


    const date =
        document.createElement(
            "p"
        );


    date.textContent =
        new Date(
            chat.createdAt
        ).toLocaleString();


    info.appendChild(
        title
    );


    info.appendChild(
        date
    );


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "conversation-actions";


    /* =================================================
       OPEN BUTTON
    ================================================= */

    const openBtn =
        document.createElement(
            "button"
        );


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


            showView(
                "chat"
            );

        }
    );


    actions.appendChild(
        openBtn
    );


    /* =================================================
       FAVORITE BUTTON
    ================================================= */

    if (

        type === "saved" ||

        type === "favorite"

    ) {

        const favoriteBtn =
            document.createElement(
                "button"
            );


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


    /* =================================================
       DELETE BUTTON
    ================================================= */

    const deleteBtn =
        document.createElement(
            "button"
        );


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


    card.appendChild(
        info
    );


    card.appendChild(
        actions
    );


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


    if (chatMessages) {

        chatMessages.innerHTML =
            "";

    }


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
   TOGGLE FAVORITE
===================================================== */

function toggleFavorite(
    id
) {

    const saved =
        getData(
            SAVED_KEY
        );


    const chat =
        saved.find(
            item =>
                item.id === id
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
            getData(
                SAVED_KEY
            );


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
            getData(
                HISTORY_KEY
            );


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

const clearHistoryBtn =
    getElement(
        "clearHistoryBtn"
    );


if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener(
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

}


/* =====================================================
   MOBILE MENU
===================================================== */

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            if (sidebar) {

                sidebar.classList.add(
                    "open"
                );

            }


            if (sidebarOverlay) {

                sidebarOverlay.classList.add(
                    "show"
                );

            }

        }
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


function closeSidebar() {

    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {

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
                "name"
            );


            localStorage.removeItem(
                "email"
            );


            localStorage.removeItem(
                "user"
            );


            localStorage.removeItem(
                "currentUser"
            );


            localStorage.removeItem(
                "loggedInUser"
            );


            localStorage.removeItem(
                "loginUser"
            );


            localStorage.removeItem(
                "currentConversation"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   THEME
===================================================== */

const themeSelect =
    getElement(
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


    if (themeSelect) {

        themeSelect.value =
            "dark";

    }

}


if (themeSelect) {

    themeSelect.addEventListener(
        "change",
        () => {

            if (
                themeSelect.value ===
                "dark"
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

}


/* =====================================================
   ENTER TO SEND
===================================================== */

const enterToSend =
    getElement(
        "enterToSend"
    );


const savedEnterSetting =
    localStorage.getItem(
        "enterToSend"
    );


if (
    enterToSend
) {

    if (
        savedEnterSetting ===
        "false"
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

}


/* =====================================================
   DELETE LOCAL DATA
===================================================== */

const deleteLocalDataBtn =
    getElement(
        "deleteLocalDataBtn"
    );


if (deleteLocalDataBtn) {

    deleteLocalDataBtn.addEventListener(
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

}


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
            JSON.parse(
                stored
            );


        if (

            !Array.isArray(
                messages
            ) ||

            messages.length === 0

        ) {

            return;

        }


        conversation =
            messages;


        if (chatMessages) {

            chatMessages.innerHTML =
                "";

        }


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

if (chatMessages) {

    /*
       Only show welcome message when
       there is no existing conversation.
    */

    const existingConversation =
        localStorage.getItem(
            "currentConversation"
        );


    if (
        existingConversation
    ) {

        restoreConversation();

    }

    else {

        showWelcomeMessage();

    }

}


/* =====================================================
   DEFAULT VIEW
===================================================== */

showView("chat");