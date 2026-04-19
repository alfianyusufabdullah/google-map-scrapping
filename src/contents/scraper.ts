import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://*.google.com/maps/*", "https://*.google.co.id/maps/*"]
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _getXPathText(xpath: string, contextNode: Node = document): string {
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

// Find the detail pane's h1 element (NOT inside the feed)
function findDetailPaneH1(): HTMLHeadingElement | null {
  const allH1s = document.querySelectorAll("h1")
  for (const h1 of Array.from(allH1s)) {
    // Skip h1s that live inside the search results feed
    if (h1.closest('[role="feed"]')) continue
    // The detail pane h1 contains the place name (not "Hasil", "Results", etc.)
    // It's usually the one that's NOT a section header
    const text = h1.textContent?.trim() || ""
    if (text.length > 0) return h1 as HTMLHeadingElement
  }
  return null
}

// Walk up from h1 to find rating/review data within the detail pane only
function findRatingFromH1(h1: HTMLElement): { rating: string; reviews: string } {
  let ancestor: HTMLElement | null = h1.parentElement

  for (let depth = 0; depth < 10; depth++) {
    if (!ancestor) break
    // STOP: if this ancestor contains the feed, we've gone too far up
    if (ancestor.querySelector('[role="feed"]')) break

    // Search this subtree for a rating-like span (e.g. "4,8" or "4.5")
    const spans = ancestor.querySelectorAll('span[aria-hidden="true"]')
    for (const span of Array.from(spans)) {
      const text = span.textContent?.trim() || ""
      if (/^\d[.,]\d$/.test(text)) {
        // Found rating! Now find review count nearby.
        // Walk up a few levels from rating span to find a "(N)" pattern
        let reviewAncestor: HTMLElement | null = span.parentElement
        let reviews = ""
        for (let i = 0; i < 5 && reviewAncestor; i++) {
          const allSpans = reviewAncestor.querySelectorAll("span")
          for (const s of Array.from(allSpans)) {
            const t = s.textContent?.trim() || ""
            // Match "(7.157)", "(1,234)", "(803)" etc.
            if (/^\([\d.,\s]+\)$/.test(t)) {
              reviews = t.replace(/[()]/g, "").trim()
              break
            }
          }
          if (reviews) break
          reviewAncestor = reviewAncestor.parentElement
        }
        return { rating: text, reviews }
      }
    }

    ancestor = ancestor.parentElement
  }

  return { rating: "", reviews: "" }
}

async function extractDetails(sessionId: string): Promise<ScrapedData> {
  // Wait a bit for the pane to fully render
  await sleep(1500)

  // Step 1: Find the detail pane h1 (place title) — no obfuscated classes
  const h1 = findDetailPaneH1()
  const title = h1?.textContent?.trim() || ""

  // Step 2: Find rating & reviews by DOM traversal from h1
  let ratingScore = ""
  let reviewCount = ""
  if (h1) {
    const { rating, reviews } = findRatingFromH1(h1)
    ratingScore = rating
    reviewCount = reviews
  }

  // Step 3: Address & phone — use stable data-item-id attributes (not class-based)
  // Strip non-printable Unicode chars (icons, BOM, zero-width spaces) that GMaps embeds
  const sanitize = (raw: string) =>
    raw
      .replace(
        /[^\x20-\x7E\u00A0-\u024F\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF\u3000-\u303F\uAC00-\uD7AF]/g,
        ""
      )
      .trim()

  const addressButton = document.querySelector('button[data-item-id="address"]')
  const address = sanitize(addressButton?.querySelector("div:last-of-type")?.textContent || "")

  const phoneButton = document.querySelector('button[data-item-id^="phone:tel:"]')
  const phone = sanitize(phoneButton?.querySelector("div:last-of-type")?.textContent || "")

  // Step 4: Website — use stable data-item-id attribute
  let website = ""
  try {
    const websiteNode = document.querySelector('a[data-item-id="authority"]') as HTMLAnchorElement
    if (websiteNode) {
      const href = websiteNode.getAttribute("href")
      if (href) {
        website = new URL(href, window.location.origin).href
      }
    }
  } catch (e) {
    console.error("Error extracting website:", e)
  }

  // Step 5: Coordinates from URL
  let coordinates = ""
  const match = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (match) {
    coordinates = `${match[1]},${match[2]}`
  }

  return {
    sessionId,
    title,
    ratingScore,
    reviewCount,
    address,
    phone,
    website,
    coordinates
  } as ScrapedData
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

      // Find all result card links inside the feed
      const feedEl = document.querySelector('[role="feed"]')
      const cards = feedEl ? feedEl.querySelectorAll('a[href*="/maps/place/"]') : []
      const snapshotLength = cards.length
      console.log(
        `SCRAPER: Found ${snapshotLength} cards in current view. Progress: ${results.length}/${limit}`
      )

      for (let i = 0; i < snapshotLength; i++) {
        if (results.length >= limit) break

        // Re-check before deep extraction logic
        const interimCheck = await chrome.storage.local.get(["isScraping"])
        if (interimCheck.isScraping === false) {
          console.log("SCRAPER: Stop signal received during card iteration. Halting.")
          isScrolling = false // force outer loop break too
          break
        }

        const card = cards[i] as HTMLAnchorElement
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
        const backButton = document.querySelector(
          'button[aria-label="Back"], button[aria-label="Kembali"], button[jsaction*="back"]'
        ) as HTMLButtonElement

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
        const wasCancelled = finalCheck.isScraping === false

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

    const searchBox = document.querySelector(
      'input#searchboxinput, input[aria-label*="Maps"], input[name="q"]'
    ) as HTMLInputElement
    const searchButton = document.querySelector(
      'button#searchbox-searchbutton, button[aria-label*="Search"], button[aria-label*="Telusuri"]'
    ) as HTMLButtonElement

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
        searchBox.dispatchEvent(
          new KeyboardEvent("keyup", {
            key: "Enter",
            code: "Enter",
            bubbles: true
          })
        )

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
      sendResponse({
        success: false,
        error: "Elemen pencarian tidak ditemukan. Silakan refresh halaman."
      })
    }
  }
  return true
})
