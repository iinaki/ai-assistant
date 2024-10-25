const initialPrompt = "You are a friendly, helpful assistant specialized in helping disabled people navigate the web. In every prompt you will receive a user message and the information about the page the user is currently on, this info will consist of the url of the site, the site's title and a list of links to help you gide him through the site. Your goal is to provide useful information and help the user navigate the page.";

let session = null;
let previousScrapedData = null;

// request scraped data from background.js
function requestScrapedData() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'REQUEST_SCRAPED_DATA' }, (response) => {
      if (response && response.data) {
        console.log('Scraped data received in popup.js:', response.data);
        resolve(response.data); 
      }
    });
  });
}

async function initializeLanguageModel() {
  if (!session) {
    session = await ai.languageModel.create({
      systemPrompt: initialPrompt,
    });
    console.log("Language model session created");
  }
}

function addMessageToChat(sender, message) {
  const chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
  chatOutput.scrollTop = chatOutput.scrollHeight;

  saveChatHistory();
}

async function sendMessage(message) {
  try {
    await initializeLanguageModel();
  } catch (error) {
    console.log('Error:', error);
    addMessageToChat('Error', error.message);
    return;
  }
  
  addMessageToChat('You', message);

  let scrapedData = null;
   
  try {
    scrapedData = await requestScrapedData();
  } catch (error) {
    console.log('Error:', error);
    addMessageToChat('Error', error.message);
    return;
  }

  console.log('Scraped data: ', scrapedData);
  console.log('Scraped data links: ', scrapedData.links);

  let prompt = '';

  if (scrapedData == previousScrapedData) {
    prompt = `
      User message: ${message}.
    `;
  } else {
    prompt = `
      User message: ${message}.
      Page URL: ${scrapedData.url}.
      Page title: ${scrapedData.title}.
      Page links: ${scrapedData.links.join(', ')}.
    `;
    previousScrapedData = scrapedData;
  }

  console.log('Prompt:', prompt);

  try {
    const response = await session.prompt(prompt);
    addMessageToChat('AI', response);
  } catch (error) {
    addMessageToChat('Error', error.message);
    console.log('Error:', error);
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
