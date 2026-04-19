import "./style.css"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Switch } from "~/components/ui/switch"
import { Search, MapPin, Database } from "lucide-react"

function IndexSidePanel() {
  const [keyword, setKeyword] = useState("")
  const [isAutoScroll, setIsAutoScroll] = useState(true)

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
            <Label htmlFor="keyword">Search Keyword</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="keyword"
                className="pl-9"
                placeholder="e.g., Coffee Shops in Bali"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
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
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" size="lg">
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
      </Card>
    </div>
  )
}

export default IndexSidePanel
