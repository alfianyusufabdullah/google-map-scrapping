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
  FolderOpen
} from "lucide-react"

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

// --- Main Component ---

function OptionsIndex() {
  const [data, setData] = useState<ScrapedData[]>([])
  const [selectedSession, setSelectedSession] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>("default")
  const [hideNoWebsite, setHideNoWebsite] = useState(false)
  const [hideNoPhone, setHideNoPhone] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  // Instead of an effect, we reset pagination when filtering
  const handleSessionChange = (val: string) => {
    setSelectedSession(val)
    setCurrentPage(1)
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }
  const handleRatingChange = (val: string) => {
    setMinRating(parseFloat(val))
    setCurrentPage(1)
  }
  const handleSortChange = (val: string) => {
    setSortBy(val)
    setCurrentPage(1)
  }
  const handleWebsiteFilter = (val: boolean) => {
    setHideNoWebsite(val)
    setCurrentPage(1)
  }
  const handlePhoneFilter = (val: boolean) => {
    setHideNoPhone(val)
    setCurrentPage(1)
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

  const exportCSV = () => {
    if (data.length === 0) return

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
    const rows = data.map((item) => [
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
      `google_maps_export_${new Date().toISOString().split("T")[0]}.csv`
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
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = parseFloat(item.ratingScore) >= minRating
    const hasWebsite = !hideNoWebsite || !!item.website
    const hasPhone = !hideNoPhone || !!item.phone
    return matchesSearch && matchesRating && hasWebsite && hasPhone
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
              <SidebarMenuButton onClick={exportCSV} disabled={data.length === 0}>
                <Download />
                <span>Export CSV</span>
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
                  {/* Toolbar */}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search business names, addresses, or locations..."
                      className="h-11 border-slate-200 pl-10 shadow-none focus:ring-primary dark:border-slate-800"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <Button variant="outline" size="sm" onClick={exportCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>

                  {/* Data Table */}
                  <div className="overflow-hidden rounded-md border w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead className="w-[45%]">Business & Address</TableHead>
                          <TableHead className="w-[10%]">Rating</TableHead>
                          <TableHead className="w-[15%]">Phone</TableHead>
                          <TableHead className="w-[30%]">Website</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.length ? (
                          paginatedData.map((item, index) => {
                            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1
                            return (
                              <TableRow key={index}>
                                <TableCell className="text-muted-foreground font-mono text-xs">
                                  {actualIndex}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    <span className="font-semibold">{item.title}</span>
                                    <div className="flex items-start gap-1.5 text-muted-foreground">
                                      <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
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
                                      <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
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
                            <TableCell colSpan={5} className="h-24 text-center">
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
