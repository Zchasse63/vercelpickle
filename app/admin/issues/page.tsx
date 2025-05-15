import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminIssuesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Issues</h1>
        <p className="text-muted-foreground">Track and resolve platform issues and bugs.</p>
      </div>

      <div className="space-y-4 animate-fade-up delay-100">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Active Issues</CardTitle>
            <CardDescription>Current platform issues that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Issue tracking interface will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
