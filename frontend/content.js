// Function to add a custom button to LinkedIn posts
function addCustomButton() {
    const posts = document.querySelectorAll('div.feed-shared-update-v2');

    posts.forEach(post => {
        const actionBar = post.querySelector('.feed-shared-social-action-bar');
        if (actionBar && !actionBar.querySelector('.custom-button')) {
            const customButton = document.createElement('button');
            customButton.textContent = 'Show Content';
            customButton.className = 'artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view custom-button';
            customButton.style.marginLeft = '10px';

            customButton.addEventListener('click', function() {
                const fullText = extractPostContent(post);
                initializeSidebar(fullText);
                chrome.runtime.sendMessage({
                    type: 'COPY_CONTENT',
                    content: fullText
                });
            });

            actionBar.appendChild(customButton);
        }
    });
}

// Extracts all text from a post
function extractPostContent(post) {
    let text = '';
    let elements = post.querySelectorAll('.update-components-text, .feed-shared-text');
    elements.forEach(element => {
        text += ' ' + element.textContent.trim();
    });
    return text.trim();
}

// Initializes the sidebar for the first time with the post explanation
function initializeSidebar(content) {
    let sidebar = document.querySelector('.custom-sidebar');
    if (!sidebar) {
        sidebar = document.createElement('div');
        sidebar.className = 'custom-sidebar';
        sidebar.style = "width: 300px; height: 100%; position: fixed; top: 0; right: 0; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.2); z-index: 1000; padding: 10px; overflow-y: auto;";
        document.body.appendChild(sidebar);
    }
    sidebar.innerHTML = `
        <h1>Post Content</h1>
        <div id="chatLog" class="chat-log">
            <p><strong>AI:</strong> ${content}</p>
        </div>
        <input type="text" id="userQuery" placeholder="Ask something..." style="width: 90%; margin-top: 10px;">
        <button id="askButton" class="artdeco-button artdeco-button--2" style="margin-top: 5px;">Ask!</button>
    `;
    document.getElementById('askButton').addEventListener('click', handleUserQuery);
}

// Handles user queries and updates the chat log
function handleUserQuery() {
    const userInputField = document.getElementById('userQuery');
    const userInput = userInputField.value.trim();
    if (userInput !== '') {
        appendToChatLog("User", userInput);  // Display user query in the chat
        chrome.runtime.sendMessage({
            type: 'USER_QUERY',
            query: userInput
        });

        userInputField.value = ''; // Clear the input field after sending
    }
}

// Append messages to the chat log
function appendToChatLog(sender, text) {
    const chatLog = document.getElementById('chatLog');
    chatLog.innerHTML += `<p><strong>${sender}:</strong> ${text}</p>`;
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the latest entry
}

// Listen for responses from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "FROM_BACKGROUND") {
        appendToChatLog("AI", message.data.content); // Display AI response in the chat
    }
});

// Observer to monitor changes in the DOM
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
            addCustomButton();
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
addCustomButton();
