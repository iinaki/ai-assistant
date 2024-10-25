// from the content script we can access elements of the DOM that the user sees
function scrapePage() {
  console.log("begin scraping");

  const pageData = {
    url: window.location.href,
    title: document.title,
    links: Array.from(document.querySelectorAll('a')).map(a => a.href)
  };
  
  console.log('in content: Scraped page data:', pageData);

  // send the scraped page data to the background script
  chrome.runtime.sendMessage({ type: 'PAGE_SCRAPED_DATA', data: pageData });
}

scrapePage();
  