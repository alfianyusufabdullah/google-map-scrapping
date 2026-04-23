import "./style.css"
import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/card"
import { Search, MapPin, Database, Hash, Loader2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "~/components/ui/sonner"

function IndexSidePanel() {
  const [context, setContext] = useState("")
  const [location, setLocation] = useState("")
  const [limit, setLimit] = useState(500)
  const [isScraping, setIsScraping] = useState(false)
  const [currentSessionCount, setCurrentSessionCount] = useState(0)
  const [currentSessionLimit, setCurrentSessionLimit] = useState(500)

  // Sync isScraping state with storage for persistence
  useEffect(() => {
    chrome.storage.local.get(
      ["isScraping", "scrapingTabId", "currentSessionCount", "currentSessionLimit"],
      (res) => {
        const storedIsScraping = !!res.isScraping
        setIsScraping(storedIsScraping)
        setCurrentSessionCount(Number(res.currentSessionCount) || 0)
        if (res.currentSessionLimit) {
          setCurrentSessionLimit(Number(res.currentSessionLimit))
        }

        // If storage says we are scraping, verify if the tab is still alive
        if (storedIsScraping && typeof res.scrapingTabId === "number") {
          chrome.tabs.sendMessage(
            res.scrapingTabId as number,
            { action: "PING" },
            (response: { success: boolean } | undefined) => {
              if (chrome.runtime.lastError || !response) {
                console.log("SIDEPANEL: Health check failed. Resetting state.")
                setIsScraping(false)
                chrome.storage.local.set({ isScraping: false, scrapingTabId: null })
              }
            }
          )
        }
      }
    )

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.isScraping) {
        setIsScraping(!!changes.isScraping.newValue)
      }
      if (changes.currentSessionCount) {
        setCurrentSessionCount(Number(changes.currentSessionCount.newValue) || 0)
      }
      if (changes.currentSessionLimit) {
        setCurrentSessionLimit(Number(changes.currentSessionLimit.newValue) || 500)
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    const handleMessage = (message: {
      action: string
      payload?: { count: number; wasCancelled: boolean }
    }) => {
      if (message.action === "SCRAPING_COMPLETE" && message.payload) {
        const { count, wasCancelled } = message.payload
        if (wasCancelled) {
          toast.warning(`Scraping Dihentikan! Berhasil menyimpan ${count} data.`, {
            duration: 5000
          })
        } else {
          toast.success(`Scraping Selesai! Berhasil mengambil ${count} data.`, {
            duration: 5000
          })
        }
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  const handleStartScraping = () => {
    if (!context.trim() || !location.trim()) {
      toast.error("Harap isi Context dan Location!")
      return
    }

    if (limit <= 0 || limit > 5000) {
      toast.error("Limit harus antara 1 sampai 5000!")
      return
    }

    setCurrentSessionCount(0)
    setCurrentSessionLimit(limit)
    // Set loading state immediately in UI
    setIsScraping(true)
    chrome.storage.local.set({
      isScraping: true,
      currentSessionCount: 0,
      currentSessionLimit: limit
    })

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
          toast.error(
            response?.error ||
              "Gagal menghubungi Google Maps. Pastikan tab Maps aktif dan sudah di-refresh."
          )
        }
      }
    )
  }

  const handleStopScraping = () => {
    setIsScraping(false)
    // The scraper loop in content script now checks this storage value dynamically
    chrome.storage.local.set({ isScraping: false })
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
          <CardDescription>Set parameters before starting the extraction process.</CardDescription>
        </CardHeader>

        {!isScraping ? (
          <>
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
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" size="lg" onClick={handleStartScraping}>
                Start Scraping
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })}
              >
                <Database className="w-4 h-4" />
                View Results Database
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardContent className="pt-6 pb-8 flex flex-col items-center text-center space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Scraping Active</h3>
              <p className="text-sm text-muted-foreground">
                Extracting "{context}" in "{location}"
              </p>
            </div>

            <div className="w-full py-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-black text-primary tracking-tighter">
                {currentSessionCount}
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                out of {currentSessionLimit} items found
              </div>
            </div>

            <Button
              className="w-full gap-2 mt-4"
              variant="destructive"
              size="lg"
              onClick={handleStopScraping}
            >
              <XCircle className="w-5 h-5" />
              STOP & RESET
            </Button>
          </CardContent>
        )}
      </Card>
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default IndexSidePanel
