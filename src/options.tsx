import "./style.css"
import { useState, useEffect } from "react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Trash2, Download, RefreshCw, Database, Search, Star, StarHalf, ArrowUpDown } from "lucide-react"

interface ScrapedData {
  sessionId: string
  title: string
  ratingScore: string
  reviewCount: string
  address: string
  phone: string
  website: string
  coordinates: string
}

const StarRating = ({ rating }: { rating: string }) => {
  const score = parseFloat(rating) || 0
  const fullStars = Math.floor(score)
  const hasHalfStar = score % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="w-3.5 h-3.5 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-muted-foreground/30" />
      ))}
      <span className="ml-1.5 font-bold text-slate-700 dark:text-slate-200 text-sm">
        {rating || "0"}
      </span>
    </div>
  )
}

function OptionsIndex() {
  const [data, setData] = useState<ScrapedData[]>([])
  const [selectedSession, setSelectedSession] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>("default")
  const [hideNoWebsite, setHideNoWebsite] = useState(false)
  const [hideNoPhone, setHideNoPhone] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    chrome.storage.local.get(["scrapedData"], (res) => {
      const storedData = (res.scrapedData as ScrapedData[]) || []
      setData(storedData)
      
      // Auto-select the most recent session if available
      if (storedData.length > 0) {
        const uniqueSessions = Array.from(new Set(storedData.map(item => item.sessionId || "Legacy Session")))
        // Sessions are roughly timestamped, sort descending to get newest
        uniqueSessions.sort((a, b) => b.localeCompare(a))
        setSelectedSession(uniqueSessions[0])
      } else {
        setSelectedSession("")
      }
    })
  }

  const clearDatabase = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data?")) {
      chrome.storage.local.set({ scrapedData: [] }, () => {
        setData([])
      })
    }
  }

  const exportCSV = () => {
    if (data.length === 0) return

    const headers = ["Session ID", "Title", "Rating Score", "Review Count", "Address", "Phone", "Website", "Coordinates"]
    const rows = data.map(item => [
      `"${item.sessionId || "Legacy Session"}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.ratingScore}"`,
      `"${item.reviewCount}"`,
      `"${item.address.replace(/"/g, '""')}"`,
      `"${item.phone}"`,
      `"${item.website}"`,
      `"${item.coordinates}"`
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `google_maps_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Grouping logic
  const groupedData = data.reduce((acc, item) => {
    const key = item.sessionId || "Legacy Session"
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, ScrapedData[]>)

  const sessionIds = Object.keys(groupedData).sort((a, b) => b.localeCompare(a))

  const currentData = selectedSession ? groupedData[selectedSession] || [] : []

  const filteredData = currentData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = parseFloat(item.ratingScore) >= minRating
    const hasWebsite = !hideNoWebsite || !!item.website
    const hasPhone = !hideNoPhone || !!item.phone
    return matchesSearch && matchesRating && hasWebsite && hasPhone
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "rating-desc") return (parseFloat(b.ratingScore) || 0) - (parseFloat(a.ratingScore) || 0)
    if (sortBy === "rating-asc") return (parseFloat(a.ratingScore) || 0) - (parseFloat(b.ratingScore) || 0)
    if (sortBy === "reviews-desc") return (parseInt(b.reviewCount.replace(/,/g, '')) || 0) - (parseInt(a.reviewCount.replace(/,/g, '')) || 0)
    return 0
  })

  console.log(sortedData);
  

  return (
    <ScrollArea className="h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        {/* Sticky Sidebar */}
        <aside className="w-80 border-r bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col gap-6 sticky top-0 h-screen shrink-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-primary">Dashboard</h1>
            <p className="text-sm text-muted-foreground leading-none">Scraper Management</p>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Session Selection</Label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a session" />
                </SelectTrigger>
                <SelectContent>
                  {sessionIds.map(id => (
                    <SelectItem key={id} value={id}>
                      {id.length > 30 ? id.substring(0, 30) + "..." : id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Display & Sort</Label>
              
              <div className="space-y-2">
                <Label className="text-sm">Order By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      <SelectValue placeholder="Default Order" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Sequence</SelectItem>
                    <SelectItem value="rating-desc">Highest Rating</SelectItem>
                    <SelectItem value="rating-asc">Lowest Rating</SelectItem>
                    <SelectItem value="reviews-desc">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Minimum Rating</Label>
                <Select value={minRating.toString()} onValueChange={(val) => setMinRating(parseFloat(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="3">3.0+ Stars</SelectItem>
                    <SelectItem value="4">4.0+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-no-website" className="text-sm cursor-pointer">Hide No Website</Label>
                  <Switch 
                    id="hide-no-website" 
                    checked={hideNoWebsite} 
                    onCheckedChange={setHideNoWebsite}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-no-phone" className="text-sm cursor-pointer">Hide No Phone</Label>
                  <Switch 
                    id="hide-no-phone" 
                    checked={hideNoPhone} 
                    onCheckedChange={setHideNoPhone}
                  />
                </div>
              </div>
            </div>

          <div className="space-y-3 pt-4 border-t">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Actions</Label>
              <div className="grid gap-2">
                <Button variant="default" onClick={loadData} className="w-full justify-start">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Results
                </Button>
                <Button variant="secondary" onClick={exportCSV} disabled={data.length === 0} className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
                
                <div className="pt-4 mt-2 border-t border-dashed">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      if (confirm(`Hapus sesi "${selectedSession}"?`)) {
                        const newData = data.filter(d => (d.sessionId || "Legacy Session") !== selectedSession)
                        chrome.storage.local.set({ scrapedData: newData }, loadData)
                      }
                    }} 
                    disabled={!selectedSession}
                    className="w-full justify-start"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Session
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={clearDatabase} 
                    disabled={data.length === 0} 
                    className="w-full justify-start"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Full History
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t bg-slate-50/80 dark:bg-slate-900/80 -mx-6 px-6 pb-2">
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3 opacity-60">System Statistics</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                <div className="text-2xl font-black text-primary leading-none">{data.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold mt-2 tracking-tighter">Total Records</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                <div className="text-2xl font-black text-primary leading-none">{sessionIds.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold mt-2 tracking-tighter">Total Sessions</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-hidden">
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search business names, addresses, or locations..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="text-sm font-medium px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                Found <b>{sortedData.length}</b> matches
              </div>
            </div>

            <Card className="border shadow-md overflow-hidden bg-white dark:bg-slate-950">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-2xl font-black tracking-tight">
                      {selectedSession || "Overview"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Displaying {sortedData.length} entries for this view.
                    </CardDescription>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {selectedSession ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Rating Analysis</TableHead>
                        <TableHead>Location Address</TableHead>
                        <TableHead>Contact Number</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <StarRating rating={item.ratingScore} />
                              <div className="text-[10px] text-muted-foreground ml-0.5 font-medium uppercase tracking-tighter">
                                {item.reviewCount || "No"} Reviews
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.address}</TableCell>
                          <TableCell className="font-mono">{item.phone || "-"}</TableCell>
                          <TableCell className="text-right">
                            {item.website ? (
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={item.website.startsWith('http') ? item.website : `https://${item.website}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                >
                                  Visit
                                </a>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">No Website</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-muted-foreground bg-slate-50/30 dark:bg-slate-900/30 space-y-4">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-dashed">
                      <Database className="w-10 h-10 opacity-20" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-medium text-slate-600 dark:text-slate-400">No session selected</p>
                      <p className="text-sm opacity-60">Choose a session from the sidebar to view your data.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ScrollArea>
  )
}

export default OptionsIndex
