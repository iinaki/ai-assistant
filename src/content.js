// content.js
// en el content puedo acceder a elementos del DOM que ve el usuario
function scrapePage() {
    const pageData = {
      url: window.location.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
      headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(heading => heading.innerText),
      paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.innerText).slice(0, 5),  // Limit number of paragraphs
      links: Array.from(document.querySelectorAll('a')).map(a => a.href).slice(0, 5),  // Limit number of links
      images: Array.from(document.querySelectorAll('img')).map(img => img.src).slice(0, 5)  // Limit number of images
    };
  
    // Send the scraped page data to the background script
    chrome.runtime.sendMessage({ type: 'PAGE_SCRAPED_DATA', data: pageData });
  }
  
  scrapePage();
  
  