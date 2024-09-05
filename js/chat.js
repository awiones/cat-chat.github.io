document.addEventListener("DOMContentLoaded", function () {
    const chatIcon = document.getElementById("chat-icon");
    let chatContainer;
    let isTyping = false; // Track if the cat is currently typing
    let typingTimeout; // Track typing timeout

    // Define an array of possible cat responses
    const catResponses = [
        "Meow",
        "Meow meow",
        "Purr",
        "Hiss",
        "*Yawn*",
        "*Stretch*",
        "Mew",
        "Purr meow",
        "Hiss meow",
        "Meow? Meow!",
        "Meow.... meow meow?, mew... mew, Mewo... me- Hiss..."
    ];

    // Load chat history when the page loads
    function loadChatHistory() {
        const chatLog = chatContainer.querySelector(".chat-log");
        const chatHistory = localStorage.getItem("chatHistory");
        if (chatHistory) {
            chatLog.innerHTML = chatHistory;
            autoScroll(); // Scroll to the bottom after loading the chat history
        }
    }

    // Save chat history to localStorage
    function saveChatHistory() {
        const chatLog = chatContainer.querySelector(".chat-log");
        localStorage.setItem("chatHistory", chatLog.innerHTML);
    }

    // Auto scroll to the bottom of the chat log
    function autoScroll() {
        const chatLog = chatContainer.querySelector(".chat-log");
        chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
    }

    chatIcon.addEventListener("click", function () {
        if (!chatContainer) {
            chatContainer = document.createElement("div");
            chatContainer.className = "chat-container";
            chatContainer.innerHTML = `
                <div class="chat-box">
                    <div class="chat-header">
                        <div class="profile-section">
                            <img src="img/profile-icon.png" class="profile-icon" alt="Profile Icon" />
                            <span class="cat-manager">Cat Manager</span>
                        </div>
                        <div class="new-conversation">+</div>
                    </div>
                    <div class="chat-log"></div>
                    <div class="input-container">
                        <textarea placeholder="Type a message..."></textarea>
                        <button type="button">&#10148;</button>
                    </div>
                </div>`;
            document.body.appendChild(chatContainer);

            // Ensure chat box slides in and then scrolls to the bottom
            setTimeout(() => {
                chatContainer.classList.add("visible");
                autoScroll(); // Scroll to the bottom after showing the chat box
            }, 10);

            const sendButton = chatContainer.querySelector("button");
            const chatLog = chatContainer.querySelector(".chat-log");
            const textarea = chatContainer.querySelector("textarea");
            const catManager = chatContainer.querySelector(".cat-manager");
            const newConversation = chatContainer.querySelector(".new-conversation");

            loadChatHistory(); // Load chat history when chat box is opened

            sendButton.addEventListener("click", sendMessage);
            textarea.addEventListener("keypress", function (event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                }
            });

            // Make the Cat Manager text unselectable and trigger a profile popup
            catManager.addEventListener("click", showProfile);

            // Clear chat log when the "+" is clicked
            newConversation.addEventListener("click", startNewConversation);

            // Add click animation to messages
            chatLog.addEventListener("click", function (event) {
                if (event.target.classList.contains("message")) {
                    event.target.classList.add("clicked");
                    setTimeout(() => {
                        event.target.classList.remove("clicked");
                    }, 300); // Duration of the animation
                }
            });

            function sendMessage() {
                const userMessage = textarea.value.trim();
                if (userMessage) {
                    const userMessageElement = document.createElement("div");
                    userMessageElement.className = "message-container user";
                    userMessageElement.innerHTML = `
                        <div class="message-name">You</div>
                        <div class="message-text">${userMessage}</div>`;
                    chatLog.appendChild(userMessageElement);

                    textarea.value = ""; // Clear the textarea after sending the message
                    autoScroll(); // Scroll to the bottom after adding user message

                    saveChatHistory(); // Save chat history after sending a message

                    if (!isTyping) {
                        isTyping = true;

                        // Simulate typing indicator
                        const typingIndicator = document.createElement("div");
                        typingIndicator.className = "typing-indicator";
                        typingIndicator.innerHTML = `<div class="cat-typing">Cat is typing...</div><div class="typing-dots"><span></span><span></span><span></span></div>`;
                        chatLog.appendChild(typingIndicator);

                        autoScroll(); // Scroll to the bottom while typing

                        // Delay before the cat's response
                        typingTimeout = setTimeout(() => {
                            // Remove the typing indicator
                            typingIndicator.remove();

                            // Create the cat's response element
                            const catResponseElement = document.createElement("div");
                            catResponseElement.className = "message-container cat";
                            // Select a random response from the array
                            const randomResponse = catResponses[Math.floor(Math.random() * catResponses.length)];
                            catResponseElement.innerHTML = `
                                <div class="message-name">Cat</div>
                                <div class="message-text">${randomResponse}</div>`;
                            chatLog.appendChild(catResponseElement);

                            autoScroll(); // Ensure scrolling to the bottom

                            isTyping = false; // Allow new typing status

                            saveChatHistory(); // Save chat history after the cat's response
                        }, 3000); // 3 seconds delay
                    }
                }
            }
        } else {
            if (!isTyping) {
                chatContainer.classList.remove("visible");
                setTimeout(() => {
                    chatContainer.remove();
                    chatContainer = null;
                }, 500);
            }
        }
    });

    // Function to show profile popup
    function showProfile() {
        alert("This is the Cat Manager's profile!");
    }

    // Function to start a new conversation
    function startNewConversation() {
        const chatLog = chatContainer.querySelector(".chat-log");
        chatLog.innerHTML = ""; // Clear the chat log in the UI
        localStorage.removeItem("chatHistory"); // Clear the chat history from storage
    }
});
