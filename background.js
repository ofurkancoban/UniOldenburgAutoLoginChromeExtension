let autoMode = false;
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === 'runLogin') {
    autoMode = true;
    chrome.tabs.sendMessage(sender.tab.id, { action: 'loginInProgress' }); // İlk tıklamada spinner
    injectScripts(sender.tab.id);
  } else if (msg.action === 'loginComplete') {
    autoMode = false;
    chrome.tabs.sendMessage(sender.tab.id, { action: 'loginSuccess' }); // Tick
  }
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if (autoMode && details.url.includes("auth.uni-oldenburg.de")) {
    // Her sayfa geçişinde spinner mesajı
    chrome.tabs.sendMessage(details.tabId, { action: 'loginInProgress' });
    injectScripts(details.tabId);
  }
});

function injectScripts(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['otplib-browser.js']
  }, () => {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  });
}