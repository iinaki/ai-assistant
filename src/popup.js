// JavaScript to handle user input, API requests, and logic.


document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatOutput = document.getElementById('chat-output');

    // Check if elements exist
    if (!chatForm) console.error("Element with id 'chat-form' not found");
    if (!userInput) console.error("Element with id 'user-input' not found");
    if (!chatOutput) console.error("Element with id 'chat-output' not found");

    // Only add event listener if chatForm exists
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userMessage = userInput.value.trim();
            if (userMessage) {
                appendMessage('User', userMessage);
                sendMessageToAPI(userMessage);
                userInput.value = '';
            }
        });
    } else {
        console.error("Chat form not found, cannot add submit event listener");
    }

    function appendMessage(sender, message) {
        chatOutput.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    function sendMessageToAPI(message) {
        const API_URL = 'https://api.openai.com/v1/chat/completions';
        const API_KEY = 'API_KEY_TINCHO_OPENAI';

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: message}],
                max_tokens: 150
            })
        };

        fetch(API_URL, requestOptions)
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                return response.json().then(data => ({ status: response.status, body: data }));
            })
            .then(({ status, body }) => {
                console.log('API Response:', body);
                
                if (status !== 200) {
                    throw new Error(`API returned status ${status}: ${JSON.stringify(body)}`);
                }
                
                if (body.choices && body.choices.length > 0 && body.choices[0].message) {
                    appendMessage('Bot', body.choices[0].message.content.trim());
                } else {
                    console.error('Unexpected API response structure:', body);
                    appendMessage('Bot', 'Sorry, I couldn\'t generate a response.');
                }
            })
            .catch(error => {
                console.error('Error details:', error);
                appendMessage('Bot', `Sorry, an error occurred: ${error.message}`);
            });
    }
});
