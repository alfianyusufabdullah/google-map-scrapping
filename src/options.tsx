import "./style.css"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
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
import { Checkbox } from "~/components/ui/checkbox"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator
} from "~/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import {
  Trash2,
  Download,
  RefreshCw,
  Database,
  Search,
  Star,
  StarHalf,
  ArrowUpDown,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  MoreHorizontal,
  Copy,
  TrendingUp,
  Users,
  BarChart3,
  FolderOpen,
  Info,
  MessageCircle
} from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

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

// --- Reusable Components ---

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
      <span className="ml-1.5 font-bold text-foreground text-sm">{rating || "0"}</span>
    </div>
  )
}

function calculateLeadScore(item: ScrapedData): number {
  let score = 0
  if (item.website) score += 30
  if (item.phone) score += 30

  const rating = parseFloat(item.ratingScore) || 0
  if (rating >= 4.0) score += 20

  const reviews = parseInt(item.reviewCount.replace(/,/g, "")) || 0
  if (reviews >= 10 && reviews <= 1000) score += 20

  return score
}

function generateRowId(item: ScrapedData): string {
  return encodeURIComponent(`${item.title}-${item.address}-${item.coordinates}`)
}

function formatWhatsAppLink(phone: string): string {
  // Remove all non-numeric characters
  let cleanNumber = phone.replace(/\D/g, "")
  // If Indonesian number starts with 0, replace with 62
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.slice(1)
  }
  return `https://wa.me/${cleanNumber}`
}

function formatMapsLink(item: ScrapedData): string {
  if (item.coordinates) {
    return `https://www.google.com/maps/place/${item.coordinates}`
  }
  const query = encodeURIComponent(`${item.title} ${item.address}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

// --- Main Component ---

function OptionsIndex() {
  const [data, setData] = useState<ScrapedData[]>([])
  const [selectedSession, setSelectedSession] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>("default")
  const [hideNoWebsite, setHideNoWebsite] = useState(false)
  const [hideNoPhone, setHideNoPhone] = useState(false)
  const [showTopTierOnly, setShowTopTierOnly] = useState(false)
  const [minReviews, setMinReviews] = useState<string>("")
  const [maxReviews, setMaxReviews] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const itemsPerPage = 50

  // Instead of an effect, we reset pagination when filtering
  const handleSessionChange = (val: string) => {
    setSelectedSession(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }
  const handleRatingChange = (val: string) => {
    setMinRating(parseFloat(val))
    setCurrentPage(1)
    setSelectedIds(new Set())
  }
  const handleSortChange = (val: string) => {
    setSortBy(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }
  const handleWebsiteFilter = (val: boolean) => {
    setHideNoWebsite(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }
  const handlePhoneFilter = (val: boolean) => {
    setHideNoPhone(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }
  const handleTopTierFilter = (val: boolean) => {
    setShowTopTierOnly(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }
  const handleMinReviewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinReviews(e.target.value)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }
  const handleMaxReviewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxReviews(e.target.value)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const loadData = () => {
    chrome.storage.local.get(["scrapedData"], (res) => {
      const storedData = (res.scrapedData as ScrapedData[]) || []
      setData(storedData)

      if (storedData.length > 0) {
        const uniqueSessions = Array.from(
          new Set(storedData.map((item) => item.sessionId || "Legacy Session"))
        )
        uniqueSessions.sort((a, b) => b.localeCompare(a))
        setSelectedSession(uniqueSessions[0])
      } else {
        setSelectedSession("")
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const clearDatabase = () => {
    if (confirm("Are you sure you want to delete all data?")) {
      chrome.storage.local.set({ scrapedData: [] }, () => {
        setData([])
      })
    }
  }

  const exportToCSV = (dataArray: ScrapedData[], filenamePrefix: string) => {
    if (dataArray.length === 0) return

    const headers = [
      "Session ID",
      "Title",
      "Rating Score",
      "Review Count",
      "Address",
      "Phone",
      "Website",
      "Coordinates"
    ]
    const rows = dataArray.map((item) => [
      `"${item.sessionId || "Legacy Session"}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.ratingScore}"`,
      `"${item.reviewCount}"`,
      `"${item.address.replace(/"/g, '""')}"`,
      `"${item.phone}"`,
      `"${item.website}"`,
      `"${item.coordinates}"`
    ])

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `google_maps_${filenamePrefix}_${new Date().toISOString().split("T")[0]}.csv`
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // --- Data processing ---
  const groupedData = data.reduce(
    (acc, item) => {
      const key = item.sessionId || "Legacy Session"
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {} as Record<string, ScrapedData[]>
  )

  const sessionIds = Object.keys(groupedData).sort((a, b) => b.localeCompare(a))
  const currentData = selectedSession ? groupedData[selectedSession] || [] : []

  const filteredData = currentData.filter((item) => {
    // 1. Advanced Search Engine
    const queryParts = searchQuery.toLowerCase().split(" ").filter(Boolean)
    let matchesSearch = true

    for (const part of queryParts) {
      if (part.startsWith("-") && part.length > 1) {
        // Negative keyword
        const exclusionTerm = part.slice(1)
        if (
          item.title.toLowerCase().includes(exclusionTerm) ||
          item.address.toLowerCase().includes(exclusionTerm)
        ) {
          matchesSearch = false
          break
        }
      } else {
        // Positive keyword (AND logic)
        if (
          !item.title.toLowerCase().includes(part) &&
          !item.address.toLowerCase().includes(part)
        ) {
          matchesSearch = false
          break
        }
      }
    }

    const matchesRating = parseFloat(item.ratingScore) >= minRating
    const hasWebsite = !hideNoWebsite || !!item.website
    const hasPhone = !hideNoPhone || !!item.phone

    // 2. Lead Quality Scoring
    const isTopTier = !showTopTierOnly || calculateLeadScore(item) >= 80

    // 3. Review Range Filtering
    const revCount = parseInt(item.reviewCount.replace(/,/g, "")) || 0
    const parsedMinRev = minReviews ? parseInt(minReviews) : 0
    const parsedMaxRev = maxReviews ? parseInt(maxReviews) : Infinity
    const matchesReviews = revCount >= parsedMinRev && revCount <= parsedMaxRev

    return matchesSearch && matchesRating && hasWebsite && hasPhone && isTopTier && matchesReviews
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "rating-desc")
      return (parseFloat(b.ratingScore) || 0) - (parseFloat(a.ratingScore) || 0)
    if (sortBy === "rating-asc")
      return (parseFloat(a.ratingScore) || 0) - (parseFloat(b.ratingScore) || 0)
    if (sortBy === "reviews-desc")
      return (
        (parseInt(b.reviewCount.replace(/,/g, "")) || 0) -
        (parseInt(a.reviewCount.replace(/,/g, "")) || 0)
      )
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const withPhone = currentData.filter((item) => !!item.phone).length
  const highlyRated = currentData.filter((item) => (parseFloat(item.ratingScore) || 0) > 4.5).length
  const withWebsite = currentData.filter((item) => !!item.website).length

  // -- Row Selection logic --
  const isAllSelected =
    sortedData.length > 0 && sortedData.every((item) => selectedIds.has(generateRowId(item)))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(sortedData.map((item) => generateRowId(item)))
      setSelectedIds(allIds)
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const exportSelectedCSV = () => {
    if (selectedIds.size === 0) return
    const selectedData = sortedData.filter((item) => selectedIds.has(generateRowId(item)))
    exportToCSV(selectedData, "selected_batch")
  }

  const deleteSelected = () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected leads?`)) return

    // Filter out the selected items from the master raw data array
    const newData = data.filter((item) => {
      // If it's the current session and its ID is in our selected set, remove it
      if ((item.sessionId || "Legacy Session") === selectedSession) {
        const id = generateRowId(item)
        if (selectedIds.has(id)) return false
      }
      return true
    })

    chrome.storage.local.set({ scrapedData: newData }, () => {
      loadData()
      setSelectedIds(new Set())
    })
  }

  return (
    <SidebarProvider>
      {/* ===== SIDEBAR ===== */}
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 px-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Database className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Maps Scraper</span>
              <span className="truncate text-xs">Dashboard</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Session Selection */}
          <SidebarGroup>
            <SidebarGroupLabel>Session</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2">
                <Select value={selectedSession} onValueChange={handleSessionChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionIds.map((id) => (
                      <SelectItem key={id} value={id}>
                        {id.length > 28 ? id.substring(0, 28) + "..." : id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Filters */}
          <SidebarGroup>
            <SidebarGroupLabel>Filters</SidebarGroupLabel>
            <SidebarGroupContent className="px-2 space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Sort By</Label>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="rating-desc">Highest Rating</SelectItem>
                    <SelectItem value="rating-asc">Lowest Rating</SelectItem>
                    <SelectItem value="reviews-desc">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Min Rating</Label>
                <Select value={minRating.toString()} onValueChange={handleRatingChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
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
                  <div className="flex items-center gap-1.5">
                    <Label
                      htmlFor="top-tier-leads"
                      className="text-xs cursor-pointer font-bold text-primary"
                    >
                      Top Tier Leads (&gt;80 Score)
                    </Label>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="w-64 p-3 bg-white dark:bg-slate-900 border shadow-lg text-sm text-slate-700 dark:text-slate-300">
                          <p className="font-bold mb-1 text-primary">Lead Score Calculation:</p>
                          <ul className="space-y-1 list-disc pl-4 text-xs">
                            <li>
                              <strong>+30 pts</strong>: Has Website
                            </li>
                            <li>
                              <strong>+30 pts</strong>: Has Phone Number
                            </li>
                            <li>
                              <strong>+20 pts</strong>: Rating is 4.0 or higher
                            </li>
                            <li>
                              <strong>+20 pts</strong>: Between 10 and 1,000 reviews
                            </li>
                          </ul>
                          <p className="mt-2 text-xs opacity-80">
                            A perfect score of 100 indicates a highly active, verifiable business.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Switch
                    id="top-tier-leads"
                    checked={showTopTierOnly}
                    onCheckedChange={handleTopTierFilter}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-no-website" className="text-xs cursor-pointer">
                    Hide No Website
                  </Label>
                  <Switch
                    id="hide-no-website"
                    checked={hideNoWebsite}
                    onCheckedChange={handleWebsiteFilter}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-no-phone" className="text-xs cursor-pointer">
                    Hide No Phone
                  </Label>
                  <Switch
                    id="hide-no-phone"
                    checked={hideNoPhone}
                    onCheckedChange={handlePhoneFilter}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground/70">
                  Reviews Range
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="h-8 text-xs"
                    value={minReviews}
                    onChange={handleMinReviewsChange}
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="h-8 text-xs"
                    value={maxReviews}
                    onChange={handleMaxReviewsChange}
                    min={0}
                  />
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer: Actions */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={loadData}>
                <RefreshCw />
                <span>Refresh</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => exportToCSV(sortedData, "filtered_session")}
                disabled={sortedData.length === 0}
              >
                <Download />
                <span>Export Session</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => exportToCSV(data, "all_data")}
                disabled={data.length === 0}
              >
                <Download />
                <span>Export All (Raw)</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator className="my-2" />
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  if (confirm(`Delete session "${selectedSession}"?`)) {
                    const newData = data.filter(
                      (d) => (d.sessionId || "Legacy Session") !== selectedSession
                    )
                    chrome.storage.local.set({ scrapedData: newData }, loadData)
                  }
                }}
                disabled={!selectedSession}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 />
                <span>Delete Session</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={clearDatabase}
                disabled={data.length === 0}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 />
                <span>Clear All</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* ===== MAIN CONTENT ===== */}
      <SidebarInset className="h-screen overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{selectedSession || "Overview"}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedSession
                  ? `${currentData.length} records in this session`
                  : "Select a session to view data"}
              </p>
            </div>
            <div className="flex items-center gap-2 pr-4">
              <Badge variant="outline" className="font-mono">
                {sessionIds.length} sessions
              </Badge>
              <Badge variant="secondary" className="font-mono">
                {data.length} total records
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-4rem)] w-full">
          <div className="p-4 md:p-8 space-y-6">
            {selectedSession ? (
              <>
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Places</CardTitle>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentData.length}</div>
                      <p className="text-xs text-muted-foreground">in this session</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Highly Rated</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{highlyRated}</div>
                      <p className="text-xs text-muted-foreground">{">"} 4.5 stars rating</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">With Phone</CardTitle>
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{withPhone}</div>
                      <p className="text-xs text-muted-foreground">
                        {currentData.length > 0
                          ? `${Math.round((withPhone / currentData.length) * 100)}% of total`
                          : "no data"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">With Website</CardTitle>
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{withWebsite}</div>
                      <p className="text-xs text-muted-foreground">
                        {currentData.length > 0
                          ? `${Math.round((withWebsite / currentData.length) * 100)}% of total`
                          : "no data"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Table Section */}
                <div className="space-y-4">
                  {/* Toolbar / Batch Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search business names, addresses, or locations..."
                        className="h-10 pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>

                    {selectedIds.size > 0 && (
                      <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-sm font-semibold whitespace-nowrap">
                          {selectedIds.size} selected
                        </span>
                        <Separator orientation="vertical" className="h-4 bg-primary/20 mx-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-primary hover:bg-primary/20 hover:text-primary"
                          onClick={exportSelectedCSV}
                        >
                          <Download className="mr-1.5 h-3.5 w-3.5" />
                          Export
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-destructive hover:bg-destructive/20 hover:text-destructive"
                          onClick={deleteSelected}
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Data Table */}
                  <div className="overflow-hidden rounded-md border w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px] pl-4">
                            <Checkbox
                              checked={isAllSelected}
                              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                              aria-label="Select all"
                            />
                          </TableHead>
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead className="w-[300px]">Business & Address</TableHead>
                          <TableHead className="w-[180px]">Rating</TableHead>
                          <TableHead className="w-[180px]">Contact Info</TableHead>
                          <TableHead className="w-[150px]">Website</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.length ? (
                          paginatedData.map((item, index) => {
                            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1
                            const rowId = generateRowId(item)
                            const isSelected = selectedIds.has(rowId)

                            return (
                              <TableRow
                                key={rowId}
                                data-state={isSelected ? "selected" : undefined}
                              >
                                <TableCell className="pl-4">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                      handleSelectRow(rowId, checked as boolean)
                                    }
                                    aria-label={`Select ${item.title}`}
                                  />
                                </TableCell>
                                <TableCell className="text-muted-foreground font-mono text-xs">
                                  {actualIndex}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    <span className="font-semibold">{item.title}</span>
                                    <div className="flex items-start gap-1.5 text-muted-foreground">
                                      <a
                                        href={formatMapsLink(item)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-0.5 shrink-0 text-primary hover:opacity-80 transition-opacity"
                                        title="View in Google Maps"
                                      >
                                        <MapPin className="h-3 w-3" />
                                      </a>
                                      <span className="text-xs">{item.address || "—"}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-0.5">
                                    <StarRating rating={item.ratingScore} />
                                    <p className="text-[11px] text-muted-foreground">
                                      {item.reviewCount || "0"} reviews
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {item.phone ? (
                                    <div className="flex items-center gap-1.5">
                                      <a
                                        href={formatWhatsAppLink(item.phone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 text-[#25D366] hover:opacity-80 transition-opacity"
                                        title="Chat on WhatsApp"
                                      >
                                        <MessageCircle className="h-4 w-4" />
                                      </a>
                                      <span className="font-mono text-sm">{item.phone}</span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {item.website ? (
                                    <a
                                      href={
                                        item.website.startsWith("http")
                                          ? item.website
                                          : `https://${item.website}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-xs font-medium text-primary hover:underline truncate max-w-[200px]"
                                    >
                                      {item.website}
                                      <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
                                    </a>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Footer with Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground font-medium">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
                      {sortedData.length} records
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="text-sm font-medium px-4 py-1.5 bg-muted rounded-md border min-w-[100px] text-center">
                        Page {currentPage} of {totalPages || 1}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No session selected</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Select a scraping session from the sidebar to view and manage your extracted
                    data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default OptionsIndex
