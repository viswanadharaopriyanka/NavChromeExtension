let originalTabId;
let capturedUrl;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "initiateCapture") {
    originalTabId = sender.tab.id;
    chrome.tabs.sendMessage(originalTabId, {action: "clickApply"}, async(response) => {
      if (response && response.clicked) {
        chrome.tabs.onUpdated.addListener(tabUpdateListener);
      }
      else if(!response.clicked){
        await chrome.storage.local.set({capturedUrl: "NolinkProvided"})
        console.log('Storage set')
      }
    });
  }
});

function tabUpdateListener(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url !== 'about:blank') {
    capturedUrl = tab.url;
    chrome.tabs.onUpdated.removeListener(tabUpdateListener);
    chrome.tabs.remove(tabId);
    
    // Store the URL in local storage

    console.log(Date.now())
    chrome.storage.local.set({capturedUrl: capturedUrl}, () => {
      console.log('URL saved:', capturedUrl);
    });
    
    chrome.storage.local.set({cutloop: "cut"}, () => {
      console.log('URL saved:', capturedUrl);
    });


    // Focus back on the original LinkedIn tab
    chrome.tabs.update(originalTabId, {active: true});
  }
}