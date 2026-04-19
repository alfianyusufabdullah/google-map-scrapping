import "./style.css"
import { useState, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Trash2, Download, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"

interface ScrapedData {
  title: string
  rating: string
  reviews: string
  address: string
  phone: string
  website: string
  coordinates: string
}

function OptionsIndex() {
  const [data, setData] = useState<ScrapedData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    chrome.storage.local.get(["scrapedData"], (res) => {
      setData((res.scrapedData as ScrapedData[]) || [])
    })
  }

  const clearDatabase = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data?")) {
      chrome.storage.local.set({ scrapedData: [] }, () => {
        setData([])
        setCurrentPage(1)
      })
    }
  }

  const exportCSV = () => {
    if (data.length === 0) return

    const headers = ["Title", "Rating", "Reviews", "Address", "Phone", "Website", "Coordinates"]
    const rows = data.map(item => [
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.rating}"`,
      `"${item.reviews}"`,
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

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Scraped Results Dashboard</h1>
            <p className="text-muted-foreground">Manage and export your extracted Google Maps data.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportCSV} disabled={data.length === 0} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="destructive" onClick={clearDatabase} disabled={data.length === 0} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dataset Overview</CardTitle>
            <CardDescription>
              Showing {data.length} total entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Business Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="w-[300px]">Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Website</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {item.rating} <span className="text-xs text-muted-foreground">({item.reviews})</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{item.address}</TableCell>
                        <TableCell className="text-sm">{item.phone || "-"}</TableCell>
                        <TableCell className="text-sm truncate max-w-[150px]">
                          {item.website ? (
                            <a href={item.website} target="_blank" className="text-primary hover:underline">
                              Visit
                            </a>
                          ) : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No data available. Start a scraping session from the side panel.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OptionsIndex
