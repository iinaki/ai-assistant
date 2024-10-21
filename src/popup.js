// JavaScript to handle user input, API requests, and logic.


import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "iniaki-api-key";

const genAI = new GoogleGenerativeAI(API_KEY);

function addMessageToChat(sender, message) {
  const chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

async function sendMessage(message) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Display user message immediately
  addMessageToChat('You', message);

  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    // Display AI response
    addMessageToChat('AI', text);
  } catch (error) {
    addMessageToChat('Error', error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
      sendMessage(message);
      input.value = '';
    }
  });
});

export {};
