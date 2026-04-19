chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_SCRAPING") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        // Store which tab is being scraped
        chrome.storage.local.set({ scrapingTabId: activeTab.id })
        
        chrome.tabs.sendMessage(activeTab.id, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Content script error:", chrome.runtime.lastError)
            sendResponse({ success: false, error: "Silakan refresh halaman Google Maps terlebih dahulu." })
            chrome.storage.local.set({ isScraping: false, scrapingTabId: null })
          } else {
            sendResponse({ success: true, data: response })
          }
        })
      } else {
        sendResponse({ success: false, error: "Tidak ada tab aktif yang ditemukan." })
      }
    })
    return true // Keep channel open for async response
  }
})

// Only monitor tab removal. 
// Refresh (loading status) is now handled via Side Panel Health Check (Ping) 
// to avoid false positives during internal navigation in Google Maps SPA.
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get(["scrapingTabId", "isScraping"], (res) => {
    if (res.isScraping && res.scrapingTabId === tabId) {
      console.log("BACKGROUND: Scraped tab closed. Resetting state.")
      chrome.storage.local.set({ isScraping: false, scrapingTabId: null })
    }
  })
})
