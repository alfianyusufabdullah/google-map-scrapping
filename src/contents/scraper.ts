import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://*.google.com/maps/*"]
}

export interface ScrapedData {
  title: string
  rating: string
  reviews: string
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

async function extractDetails(): Promise<ScrapedData> {
  // Wait a bit for the pane to fully render
  await sleep(1500)

  const title = getXPathText('//h1[contains(@class, "DUwDvf")]')
  const rating = getXPathText('//div[contains(@class, "F7kYyc")]//span[@aria-hidden="true"]')
  const reviews = getXPathText('//span[contains(@aria-label, "ulasan") or contains(@aria-label, "reviews")]')
  const address = getXPathText('//button[@data-item-id="address"]//div[contains(@class, "Io6YTe")]')
  const phone = getXPathText('//button[contains(@data-item-id, "phone:tel:")]//div[contains(@class, "Io6YTe")]')
  const website = getXPathText('//a[@data-item-id="authority"]//div[contains(@class, "Io6YTe")]')
  
  // Try to parse coordinate from the URL if possible
  let coordinates = ""
  const match = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (match) {
    coordinates = `${match[1]},${match[2]}`
  }

  return { title, rating, reviews, address, phone, website, coordinates } as ScrapedData
}

async function performScraping() {
  console.log("SCRAPER: Starting extraction loop...")
  
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
    return
  }

  console.log("SCRAPER: Feed found, starting card iteration...")

  let isScrolling = true
  let maxScrolls = 3 // Limit for testing

  while (isScrolling && maxScrolls > 0) {
    const cardsResult = document.evaluate(
      '//a[contains(@class, "hfpxzc")]',
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    )

    const snapshotLength = cardsResult.snapshotLength
    console.log(`SCRAPER: Found ${snapshotLength} cards in current view`)
    
    for (let i = 0; i < snapshotLength; i++) {
      const card = cardsResult.snapshotItem(i) as HTMLAnchorElement
      const href = card.href
      
      if (scrapedIds.has(href)) continue
      scrapedIds.add(href)

      console.log(`SCRAPER: Clicking card ${i + 1}...`)
      card.click()
      
      const details = await extractDetails()
      if (details.title) {
        results.push(details)
        console.log("SCRAPER: Extracted ->", details.title)
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
        await sleep(800)
      }
    }

    // Scroll
    const previousHeight = feedElement.scrollHeight
    feedElement.scrollTo(0, feedElement.scrollHeight)
    console.log("SCRAPER: Scrolling for more results...")
    await sleep(2500)
    
    if (feedElement.scrollHeight === previousHeight) {
      isScrolling = false
    }
    maxScrolls--
  }

  console.log("SCRAPER: Finished. Total Extracted:", results.length)
  
  chrome.storage.local.get(["scrapedData"], (res) => {
    const existing = (res.scrapedData as ScrapedData[]) || []
    chrome.storage.local.set({ scrapedData: [...existing, ...results] })
  })

  alert(`Scraping Selesai! Berhasil mengambil ${results.length} data.`)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("SCRAPER: Received message", message)
  
  if (message.action === "START_SCRAPING") {
    const { context, location } = message.payload
    
    const searchBox = document.querySelector('input#searchboxinput, input[aria-label*="Maps"], input[name="q"]') as HTMLInputElement
    const searchButton = document.querySelector('button#searchbox-searchbutton, button[aria-label*="Search"], button[aria-label*="Telusuri"]') as HTMLButtonElement

    if (searchBox && searchButton) {
      console.log("SCRAPER: Injecting query and triggering search")
      
      searchBox.focus()
      searchBox.value = `${context} ${location}`
      
      // Essential events for Google Maps to recognize the change
      searchBox.dispatchEvent(new Event("input", { bubbles: true }))
      searchBox.dispatchEvent(new Event("change", { bubbles: true }))
      
      setTimeout(() => {
        searchButton.click()
        
        setTimeout(() => {
          performScraping()
        }, 5000)
      }, 500)
      
      sendResponse({ success: true })
    } else {
      console.error("SCRAPER: Search elements not found!")
      sendResponse({ success: false, error: "Elemen pencarian tidak ditemukan. Silakan refresh halaman." })
    }
  }
  return true
})
