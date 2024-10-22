// background.js

let scrapedPageData = {};

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_SCRAPED_DATA') {
    // Store the scraped data
    scrapedPageData = message.data;
    console.log('Scraped page data stored in background.js:', scrapedPageData);
  }
});

// Handle requests from popup.js for the scraped data
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REQUEST_SCRAPED_DATA') {
    // Send the stored scraped data to the popup
    sendResponse({ data: scrapedPageData });
  }
});
