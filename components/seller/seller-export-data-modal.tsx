"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

interface SellerExportDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SellerExportDataModal({ open, onOpenChange }: SellerExportDataModalProps) {
  const [format, setFormat] = useState("CSV")
  const [dateRange, setDateRange] = useState("Last 30 days")
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsExporting(false)
    setExportSuccess(true)
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setExportSuccess(false)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Analytics Data</DialogTitle>
          <DialogDescription>
            Choose your preferred format and date range for the export.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Format
            </Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format" className="col-span-3" data-testid="export-format-select">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="Excel">Excel</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="JSON">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date-range" className="text-right">
              Date Range
            </Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="date-range" className="col-span-3" data-testid="export-date-range">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                <SelectItem value="This year">This year</SelectItem>
                <SelectItem value="All time">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          {exportSuccess && (
            <span className="text-green-600 mr-auto">Export successful</span>
          )}
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            data-testid="download-export-button"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
