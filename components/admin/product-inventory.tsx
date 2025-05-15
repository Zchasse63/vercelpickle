import { format } from "date-fns"
import { ArrowDown, ArrowUp, Plus } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InventoryRecord {
  date: string
  action: string
  quantity: number
  notes: string
}

export function ProductInventory({ inventoryHistory }: { inventoryHistory: InventoryRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory History</CardTitle>
            <CardDescription>Recent inventory changes and adjustments</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventoryHistory.map((record, index) => (
            <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  record.quantity > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {record.quantity > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{record.action}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(record.date), "MMM dd, yyyy 'at' h:mm a")}
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{record.notes}</div>
                  <div className={`font-medium ${record.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                    {record.quantity > 0 ? "+" : ""}
                    {record.quantity} units
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full">
          View Full Inventory History
        </Button>
      </CardFooter>
    </Card>
  )
}
