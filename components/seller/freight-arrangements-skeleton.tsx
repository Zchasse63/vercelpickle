"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui-kit";

export function FreightArrangementsSkeleton() {
  return (
    <div className="space-y-6" data-testid="freight-arrangements-skeleton">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-5 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-24" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="completed">
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="all">
            <Skeleton className="h-4 w-16" />
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                <Skeleton className="h-5 w-48" />
              </CardTitle>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead className="text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-48" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-48" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
