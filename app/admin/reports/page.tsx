import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Generated Reports</h1>
        <p className="text-muted-foreground">Download and view system reports for your marketplace.</p>
      </div>

      <div className="space-y-4 animate-fade-up delay-100">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>Download and view system reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Report generation interface will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
