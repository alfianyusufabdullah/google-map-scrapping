export {}

console.log("Background service worker initialized.")

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_SCRAPING") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab && activeTab.id && activeTab.url?.startsWith("https://www.google.com/maps")) {
        chrome.tabs.sendMessage(activeTab.id, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Content script error:", chrome.runtime.lastError)
            sendResponse({ success: false, error: "Silakan refresh halaman Google Maps terlebih dahulu." })
          } else {
            sendResponse({ success: true, data: response })
          }
        })
      } else {
        sendResponse({ success: false, error: "Harap buka halaman Google Maps (https://www.google.com/maps) di tab aktif." })
      }
    })
    return true // Keep channel open for async response
  }
})
