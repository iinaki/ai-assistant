// from the content script we can access elements of the DOM that the user sees
function scrapePage() {
  console.log("begin scraping");

  const pageData = {
    url: window.location.href,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
    headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(heading => heading.innerText),
    paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.innerText),
    links: Array.from(document.querySelectorAll('a')).map(a => a.href)
  };
  
  console.log('in content: Scraped page data:', pageData);

  // send the scraped page data to the background script
  chrome.runtime.sendMessage({ type: 'PAGE_SCRAPED_DATA', data: pageData });
}
  
scrapePage();
  