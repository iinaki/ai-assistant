function addMessageToChat(sender, message) {
  const chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
  chatOutput.scrollTop = chatOutput.scrollHeight;

  // Save the updated chat history in chrome.storage
  saveChatHistory();
}

async function sendMessage(message) {
  // Fetch or create a new session with Google's AI API
  const session = await ai.languageModel.create();

  addMessageToChat('You', message);

  try {
    const response = await session.prompt(message);
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

document.addEventListener('DOMContentLoaded', () => {
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
