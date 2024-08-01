chrome.action.onClicked.addListener((tab) => {
    // Ensure the tab's URL is not a restricted chrome:// URL
    if (tab.url.startsWith('chrome://')) {
      console.error('Cannot capture chrome:// URLs');
      alert('Cannot capture chrome:// URLs');
      return;
    }
    
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyToClipboard,
        args: [dataUrl]
      });
    });
  });
  
  function copyToClipboard(dataUrl) {
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(() => {
          console.log('Screenshot copied to clipboard!');
        }).catch(err => {
          console.error('Could not copy image to clipboard', err);
        });
      });
  }
  