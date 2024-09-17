let originalTabId;
let capturedUrl;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "initiateCapture") {
    originalTabId = sender.tab.id;
    chrome.tabs.sendMessage(
      originalTabId,
      { action: "clickApply" },
      async (response) => {
        if (response && response.clicked) {
          chrome.tabs.onUpdated.addListener(tabUpdateListener);
        } else {
          await chrome.storage.local.set({ capturedUrl: "NoLinkProvided" });
          console.log("No link provided, storage updated.");
        }
      }
    );
  }
});

function tabUpdateListener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url !== "about:blank") {
    capturedUrl = tab.url;
    chrome.tabs.onUpdated.removeListener(tabUpdateListener);
    chrome.tabs.remove(tabId);

    chrome.storage.local.set({ capturedUrl: capturedUrl }, () => {
      console.log("URL saved:", capturedUrl);
    });

    chrome.tabs.update(originalTabId, { active: true });
  }
}
