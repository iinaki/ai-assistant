let scrapedData = {};

// Function to request scraped data from background.js
function requestScrapedData() {
  chrome.runtime.sendMessage({ type: 'REQUEST_SCRAPED_DATA' }, (response) => {
    if (response && response.data) {
      scrapedData = response.data;
    }
  });
}

function addMessageToChat(sender, message) {
  const chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
  chatOutput.scrollTop = chatOutput.scrollHeight;

  // Save the updated chat history in chrome.storage
  saveChatHistory();
}

async function sendMessage(message) {
  // Fetch or create a new session with Google's AI API

  const session = await ai.languageModel.create({
    systemPrompt: "You are a friendly, helpful assistant specialized in helping disabled people navigate the web. In every prompt you will receive a user message and the information about the page the user is currently on. Your goal is to provide useful information and help the user navigate the page. This is the previus chat history: " + document.getElementById('chat-output').innerHTML,
  });
  
  addMessageToChat('You', message);

  console.log('Scraped data:', scrapedData);

  try {
    // Include the scraped data in the AI prompt
    const prompt = `
      User message: ${message}.
      Page URL: ${scrapedData.url}.
      Page title: ${scrapedData.title}.
      Page description: ${scrapedData.description}.
      Headings: ${scrapedData.headings}.
      Paragraphs: ${scrapedData.paragraphs}.
    `;

    const response = await session.prompt(prompt);

    addMessageToChat('AI', response);
  } catch (error) {
    addMessageToChat('Error', error.message);
  }
}

function saveChatHistory() {
  const chatOutput = document.getElementById('chat-output').innerHTML;
  chrome.storage.local.set({ chatHistory: chatOutput });
}

function loadChatHistory() {
  chrome.storage.local.get('chatHistory', (data) => {
    if (data.chatHistory) {
      document.getElementById('chat-output').innerHTML = data.chatHistory;
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  requestScrapedData();

  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');

  // Load the chat history when the popup opens
  loadChatHistory();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
      sendMessage(message);
      input.value = '';
    }
  });
});
