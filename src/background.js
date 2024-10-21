const API_KEY = 'nada';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchAIResponse") {
        const API_URL = `https://generativelanguage.googleapis.com/latest/models/gemini-1.5-flash:generateMessage?key=${API_KEY}`;

        const requestBody = {
            prompt: {
                messages: [
                    { author: "user", content: message.userMessage }
                ]
            }
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.text())  // Get the raw response as text
        .then(text => {
            console.log('Raw response:', text);  // Log the raw response
            try {
                const data = JSON.parse(text);  // Try parsing it to JSON
                if (data.candidates && data.candidates.length > 0) {
                    sendResponse({ responseText: data.candidates[0].content });
                } else {
                    sendResponse({ responseText: "Sorry, I couldn't generate a response." });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error, 'Raw response:', text);
                sendResponse({ responseText: `Error: Unable to parse response` });
            }
        })
        .catch(error => {
            console.error('Error fetching AI response:', error);
            sendResponse({ responseText: `Error: ${error.message}` });
        });

        return true; // Keep the messaging channel open for async response
    }
});
