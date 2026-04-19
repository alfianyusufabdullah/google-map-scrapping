import "./style.css"
import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Switch } from "~/components/ui/switch"
import { Search, MapPin, Database, Hash, Loader2, XCircle } from "lucide-react"

function IndexSidePanel() {
  const [context, setContext] = useState("")
  const [location, setLocation] = useState("")
  const [limit, setLimit] = useState(500)
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const [isScraping, setIsScraping] = useState(false)

  // Sync isScraping state with storage for persistence
  useEffect(() => {
    chrome.storage.local.get(["isScraping", "scrapingTabId"], (res) => {
      const storedIsScraping = !!res.isScraping
      setIsScraping(storedIsScraping)

      // If storage says we are scraping, verify if the tab is still alive
      if (storedIsScraping && typeof res.scrapingTabId === "number") {
        chrome.tabs.sendMessage(res.scrapingTabId as number, { action: "PING" }, (response: any) => {
          if (chrome.runtime.lastError || !response) {
            console.log("SIDEPANEL: Health check failed. Resetting state.")
            setIsScraping(false)
            chrome.storage.local.set({ isScraping: false, scrapingTabId: null })
          }
        })
      }
    })

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.isScraping) {
        setIsScraping(!!changes.isScraping.newValue)
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)
    return () => chrome.storage.onChanged.removeListener(handleStorageChange)
  }, [])

  const handleStartScraping = () => {
    if (!context.trim() || !location.trim()) {
      alert("Harap isi Context dan Location!")
      return
    }

    if (limit <= 0 || limit > 5000) {
      alert("Limit harus antara 1 sampai 5000!")
      return
    }

    // Set loading state immediately in UI
    setIsScraping(true)
    chrome.storage.local.set({ isScraping: true })

    chrome.runtime.sendMessage(
      {
        action: "START_SCRAPING",
        payload: { context, location, limit }
      },
      (response) => {
        // If background script or content script returns error
        if (!response?.success) {
          setIsScraping(false)
          chrome.storage.local.set({ isScraping: false })
          alert(response?.error || "Gagal menghubungi Google Maps. Pastikan tab Maps aktif dan sudah di-refresh.")
        }
      }
    )
  }

  const handleStopScraping = () => {
    setIsScraping(false)
    chrome.storage.local.set({ isScraping: false })
    // Optional: Send a stop message to content script if needed
  }

  return (
    <div className="p-4 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <MapPin className="w-6 h-6" />
        <h1 className="text-xl font-bold tracking-tight">Maps Scraper</h1>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Scraper Configuration</CardTitle>
          <CardDescription>
            Set parameters before starting the extraction process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="context">Business Context</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="context"
                className="pl-9"
                placeholder="e.g., Coffee Shops"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                disabled={isScraping}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                className="pl-9"
                placeholder="e.g., Bali"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isScraping}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Item Limit (Max 5000)</Label>
            <div className="relative">
              <Hash className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="limit"
                type="number"
                min={1}
                max={5000}
                className="pl-9"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
                disabled={isScraping}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="auto-scroll" className="text-sm font-medium">Auto Scroll</Label>
              <p className="text-xs text-muted-foreground">Automatically scroll map results</p>
            </div>
            <Switch
              id="auto-scroll"
              checked={isAutoScroll}
              onCheckedChange={setIsAutoScroll}
              disabled={isScraping}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {isScraping ? (
            <Button 
              className="w-full gap-2" 
              variant="destructive"
              size="lg" 
              onClick={handleStopScraping}
            >
              <XCircle className="w-5 h-5" />
              STOP & RESET
            </Button>
          ) : (
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleStartScraping}
            >
              Start Scraping
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })}
          >
            <Database className="w-4 h-4" />
            View Results Database
          </Button>
        </CardFooter>
      </Card>
      
      {isScraping && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3 border border-blue-100 dark:border-blue-900/30">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
            Scraping sedang berjalan di tab Maps...
          </p>
        </div>
      )}
    </div>
  )
}

export default IndexSidePanel
