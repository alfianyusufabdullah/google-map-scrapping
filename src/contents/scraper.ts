import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: [
    "https://*.google.com/maps/*",
    "https://*.google.co.id/maps/*"
  ]
}

export interface ScrapedData {
  sessionId: string
  title: string
  ratingScore: string
  reviewCount: string
  address: string
  phone: string
  website: string
  coordinates: string
}

// Helper to evaluate XPath and get text content
function getXPathText(xpath: string, contextNode: Node = document): string {
  try {
    const result = document.evaluate(
      xpath,
      contextNode,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    const node = result.singleNodeValue
    return node ? node.textContent?.trim() || "" : ""
  } catch (e) {
    console.error("XPath evaluation error:", e)
    return ""
  }
}

// Pause utility
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Randomized delay to mimic human behavior
const jitteredDelay = async (baseMs = 2000) => {
  const jitter = Math.random() * 1000 - 500 // +/- 500ms
  await sleep(baseMs + jitter)
}

async function extractDetails(sessionId: string): Promise<ScrapedData> {
  // Wait a bit for the pane to fully render
  await sleep(1500)

  const title = getXPathText('//h1[contains(@class, "DUwDvf")]')
  
  // Try to find the specific container for ratings to avoid picking up the first result in the list
  // Google Maps often uses these classes for the detail pane rating
  const ratingScore = getXPathText('//div[@role="main"]//span[contains(@class, "MW4etd")]') || 
                      getXPathText('//div[contains(@class, "F7kYyc")]//span[contains(@class, "MW4etd")]')
  
  let reviewCount = getXPathText('//div[@role="main"]//span[contains(@class, "UY7F9")]') ||
                    getXPathText('//div[contains(@class, "F7kYyc")]//span[contains(@class, "UY7F9")]')
  // Strip parentheses
  if (reviewCount) {
    reviewCount = reviewCount.replace(/[()]/g, '').trim()
  }

  const address = getXPathText('//button[@data-item-id="address"]//div[contains(@class, "Io6YTe")]')
  const phone = getXPathText('//button[contains(@data-item-id, "phone:tel:")]//div[contains(@class, "Io6YTe")]')
  
  // Website extraction
  let website = ""
  try {
    const websiteNode = document.evaluate(
      '//a[@data-item-id="authority"]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLAnchorElement
    
    if (websiteNode) {
      const href = websiteNode.getAttribute('href')
      if (href) {
        // Resolve relative URLs using URL constructor
        website = new URL(href, window.location.origin).href
      }
    }
  } catch (e) {
    console.error("Error extracting website:", e)
  }
  
  // Try to parse coordinate from the URL if possible
  let coordinates = ""
  const match = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (match) {
    coordinates = `${match[1]},${match[2]}`
  }

  return { sessionId, title, ratingScore, reviewCount, address, phone, website, coordinates } as ScrapedData
}

async function performScraping(limit: number, sessionId: string) {
  console.log(`SCRAPER: Starting extraction loop with limit: ${limit}, session: ${sessionId}`)
  chrome.storage.local.set({ isScraping: true, currentSessionCount: 0, currentSessionLimit: limit })
  
  const results: ScrapedData[] = []
  const scrapedIds = new Set<string>()

  // Wait for feed to exist
  let feedElement = document.querySelector('div[role="feed"]')
  let attempts = 0
  while (!feedElement && attempts < 15) {
    await sleep(1000)
    feedElement = document.querySelector('div[role="feed"]')
    attempts++
  }

  if (!feedElement) {
    console.error("SCRAPER: Feed container not found after search!")
    chrome.storage.local.set({ isScraping: false })
    return
  }

  console.log("SCRAPER: Feed found, starting card iteration...")

  let isScrolling = true
  
  try {
    while (isScrolling && results.length < limit) {
      // Check if user requested a stop via storage
      const storageRes = await chrome.storage.local.get(["isScraping"])
      if (storageRes.isScraping === false) {
        console.log("SCRAPER: Stop signal received. Halting extraction loop.")
        break
      }

      const cardsResult = document.evaluate(
        '//a[contains(@class, "hfpxzc")]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      )

      const snapshotLength = cardsResult.snapshotLength
      console.log(`SCRAPER: Found ${snapshotLength} cards in current view. Progress: ${results.length}/${limit}`)
      
      for (let i = 0; i < snapshotLength; i++) {
        if (results.length >= limit) break

        // Re-check before deep extraction logic
        const interimCheck = await chrome.storage.local.get(["isScraping"])
        if (interimCheck.isScraping === false) {
           console.log("SCRAPER: Stop signal received during card iteration. Halting.")
           isScrolling = false // force outer loop break too
           break
        }

        const card = cardsResult.snapshotItem(i) as HTMLAnchorElement
        const href = card.href
        
        if (scrapedIds.has(href)) continue
        scrapedIds.add(href)

        // Human-like delay before clicking
        await jitteredDelay(2000)
        
        console.log(`SCRAPER: Clicking card ${results.length + 1}...`)
        card.click()
        
        const details = await extractDetails(sessionId)
        if (details.title) {
          results.push(details)
          console.log("SCRAPER: Extracted ->", details.title)
          chrome.storage.local.set({ currentSessionCount: results.length })
        }

        // Back to results logic
        const backButton = document.evaluate(
          '//button[contains(@class, "hYBOP") or @aria-label="Back" or @aria-label="Kembali"]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue as HTMLButtonElement

        if (backButton) {
          backButton.click()
          await sleep(1000) // Small wait to return to list
        }
      }

      if (results.length < limit) {
        // Scroll for more results
        const previousHeight = feedElement.scrollHeight
        feedElement.scrollTo(0, feedElement.scrollHeight)
        console.log("SCRAPER: Scrolling for more results...")
        await jitteredDelay(2500)
        
        if (feedElement.scrollHeight === previousHeight) {
          console.log("SCRAPER: Reached end of feed.")
          isScrolling = false
        }
      }
    }
  } catch (error) {
    console.error("SCRAPER: Error during scraping:", error)
  } finally {
    console.log("SCRAPER: Finished. Total Extracted:", results.length)
    
    chrome.storage.local.get(["scrapedData"], (res) => {
      const existing = (res.scrapedData as ScrapedData[]) || []
      // We only alert if it wasn't cancelled abruptly
      chrome.storage.local.get(["isScraping"], (finalCheck) => {
         const wasCancelled = finalCheck.isScraping === false;
         
         chrome.storage.local.set({ 
           scrapedData: [...existing, ...results],
           isScraping: false 
         })

         if (wasCancelled) {
             alert(`Scraping Dihentikan! Berhasil menyimpan ${results.length} data.`)
         } else {
             alert(`Scraping Selesai! Berhasil mengambil ${results.length} data.`)
         }
      })
    })
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("SCRAPER: Received message", message)
  
  if (message.action === "PING") {
    sendResponse({ success: true })
    return true
  }

  if (message.action === "START_SCRAPING") {
    const { context, location, limit } = message.payload
    
    const searchBox = document.querySelector('input#searchboxinput, input[aria-label*="Maps"], input[name="q"]') as HTMLInputElement
    const searchButton = document.querySelector('button#searchbox-searchbutton, button[aria-label*="Search"], button[aria-label*="Telusuri"]') as HTMLButtonElement

    if (searchBox && searchButton) {
      console.log("SCRAPER: Injecting query and triggering search")
      chrome.storage.local.set({ isScraping: true })
      
      searchBox.focus()
      searchBox.value = `${context} ${location}`
      
      searchBox.dispatchEvent(new Event("input", { bubbles: true }))
      searchBox.dispatchEvent(new Event("change", { bubbles: true }))
      
      // NEW: Simulate pressing Enter key which is more reliable in Gmaps
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      })
      
      setTimeout(() => {
        console.log("SCRAPER: Dispatching Enter key events")
        searchBox.dispatchEvent(enterEvent)
        
        // Add keyup to complete the sequence
        searchBox.dispatchEvent(new KeyboardEvent("keyup", {
          key: "Enter",
          code: "Enter",
          bubbles: true
        }))

        searchButton.click()

        setTimeout(() => {
          const sessionId = `Session: ${context} ${location} (${new Date().toLocaleString()})`
          performScraping(limit || 500, sessionId)
        }, 7000)
      }, 500)
      
      sendResponse({ success: true })
    } else {
      console.error("SCRAPER: Search elements not found!")
      chrome.storage.local.set({ isScraping: false })
      sendResponse({ success: false, error: "Elemen pencarian tidak ditemukan. Silakan refresh halaman." })
    }
  }
  return true
})
