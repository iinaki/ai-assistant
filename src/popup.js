// import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEY = 'AIzaSyAxz65u-JqMZ8vLjEUov5HOrIov0It1SYI';
// const genAI = new GoogleGenerativeAI(process.env.API_KEY); 
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// document.addEventListener('DOMContentLoaded', function() {
//     const chatForm = document.getElementById('chat-form');
//     const userInput = document.getElementById('user-input');
//     const chatOutput = document.getElementById('chat-output');

//     // Check if elements exist
//     if (!chatForm) console.error("Element with id 'chat-form' not found");
//     if (!userInput) console.error("Element with id 'user-input' not found");
//     if (!chatOutput) console.error("Element with id 'chat-output' not found");

//     // Only add event listener if chatForm exists
//     if (chatForm) {
//         chatForm.addEventListener('submit', async function(e) {
//             e.preventDefault();
//             const userMessage = userInput.value.trim();
//             if (userMessage) {
//                 appendMessage('User', userMessage);
//                 const result = await model.generateContent(userMessage);
//                 let response = result.response.text();
//                 console.log(response);
//                 appendMessage('Bot', response.trim());
//                 userInput.value = '';
//             }
//         });
//     } else {
//         console.error("Chat form not found, cannot add submit event listener");
//     }

//     function appendMessage(sender, message) {
//         chatOutput.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
//         chatOutput.scrollTop = chatOutput.scrollHeight;
//     }

//     // function sendMessageToAPI(message) {
//     //     const API_URL = 'https://esm.run/@google/generative-ai';
//     //     const API_KEY = 'AIzaSyAxz65u-JqMZ8vLjEUov5HOrIov0It1SYI';

//     //     const requestOptions = {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //             'Authorization': `Bearer ${API_KEY}`
//     //         },
//     //         body: JSON.stringify({
//     //             model: "gemini-1.5-flash",
//     //             messages: [{role: "user", content: message}],
//     //             max_tokens: 150
//     //         })
//     //     };

//     //     fetch(API_URL, requestOptions)
//     //         .then(response => {
//     //             console.log('Response status:', response.status);
//     //             console.log('Response headers:', response.headers);
//     //             return response.json().then(data => ({ status: response.status, body: data }));
//     //         })
//     //         .then(({ status, body }) => {
//     //             console.log('API Response:', body);
                
//     //             if (status !== 200) {
//     //                 throw new Error(`API returned status ${status}: ${JSON.stringify(body)}`);
//     //             }
                
//     //             if (body.choices && body.choices.length > 0 && body.choices[0].message) {
//     //                 appendMessage('Bot', body.choices[0].message.content.trim());
//     //             } else {
//     //                 console.error('Unexpected API response structure:', body);
//     //                 appendMessage('Bot', 'Sorry, I couldn\'t generate a response.');
//     //             }
//     //         })
//     //         .catch(error => {
//     //             console.error('Error details:', error);
//     //             appendMessage('Bot', `Sorry, an error occurred: ${error.message}`);
//     //         });
//     // }
// });

document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatOutput = document.getElementById('chat-output');

    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userMessage = userInput.value.trim();
            if (userMessage) {
                appendMessage('User', userMessage);

                // Send message to background script to fetch AI response
                chrome.runtime.sendMessage(
                    { action: "fetchAIResponse", userMessage: userMessage },
                    function(response) {
                        appendMessage('Bot', response.responseText.trim());
                    }
                );

                userInput.value = '';
            }
        });
    }

    function appendMessage(sender, message) {
        chatOutput.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
});
