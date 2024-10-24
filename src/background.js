let scrapedPageData = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_SCRAPED_DATA') {
    // Listen for messages from content.js
    scrapedPageData = message.data;
    console.log('Scraped page data stored in background.js:', scrapedPageData);
  } else if (message.type === 'REQUEST_SCRAPED_DATA') {
    // Handle requests from popup.js for the scraped data
    sendResponse({ data: scrapedPageData });
  }
});
