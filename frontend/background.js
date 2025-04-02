chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'COPY_CONTENT':
            console.log("Processing post content:", message.content);
            fetch('http://127.0.0.1:5000/save_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: message.content })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received from server:', data);
                sendResponse({status: 'success', data: data});
                // Forward the response to the content script
                chrome.tabs.sendMessage(sender.tab.id, { type: "FROM_BACKGROUND", data: data });
            })
            .catch(error => {
                console.error('Error posting to Flask:', error);
                sendResponse({status: 'error', message: error.toString()});
            });
            return true; // To indicate an asynchronous response
            break;

        case 'USER_QUERY':
            console.log("Processing user query:", message.query);
            fetch('http://127.0.0.1:5000/user_query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: message.query })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Query response from server:', data);
                sendResponse({status: 'success', data: data});
                // Optionally, forward the response to the content script if needed
                chrome.tabs.sendMessage(sender.tab.id, { type: "FROM_BACKGROUND", data: data });
            })
            .catch(error => {
                console.error('Error posting query to Flask:', error);
                sendResponse({status: 'error', message: error.toString()});
            });
            return true; // To ensure asynchronous response handling
            break;
    }
});

// Ensure the event listener indicates asynchronous response handling by returning true
