"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  HeadingSkeleton,
  TextSkeleton,
  CardSkeleton,
  ChartSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
} from "@/components/ui/skeleton-elements";
import { skeletonArray, skeletonGrids } from "@/lib/styles/skeleton-styles";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui-kit";

export function SpecializedAnalyticsSkeleton() {
  return (
    <div className="space-y-6" data-testid="specialized-analytics-skeleton">
      {/* Page header */}
      <div>
        <HeadingSkeleton level={1} withSubheading />
      </div>

      {/* Stats cards */}
      <div className={skeletonGrids.cards3}>
        {skeletonArray(3).map((item) => (
          <CardSkeleton
            key={item.id}
            headerSize="md"
            contentLines={1}
            animation="shimmer"
          />
        ))}
      </div>

      {/* Tabs section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          {["overview", "products", "customers", "regions"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              <TextSkeleton size="sm" width="xs" />
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Charts grid */}
        <div className={skeletonGrids.cards2}>
          <Card>
            <CardHeader>
              <CardTitle>
                <TextSkeleton size="lg" width="lg" />
              </CardTitle>
              <CardDescription>
                <TextSkeleton size="sm" width="xl" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartSkeleton height="md" animation="wave" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <TextSkeleton size="lg" width="lg" />
              </CardTitle>
              <CardDescription>
                <TextSkeleton size="sm" width="xl" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartSkeleton height="md" animation="wave" />
            </CardContent>
          </Card>
        </div>

        {/* Table card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TextSkeleton size="lg" width="lg" />
            </CardTitle>
            <CardDescription>
              <TextSkeleton size="sm" width="xl" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table header */}
              <div className="flex justify-between">
                {skeletonArray(4).map((item) => (
                  <TextSkeleton key={item.id} size="sm" width="md" />
                ))}
              </div>

              {/* Table rows */}
              {skeletonArray(5).map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <TextSkeleton size="sm" width="lg" />
                  <TextSkeleton size="sm" width="xs" />
                  <TextSkeleton size="sm" width="xs" />
                  <TextSkeleton size="sm" width="xs" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Bottom cards */}
      <div className={skeletonGrids.cards2}>
        {/* Users card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TextSkeleton size="lg" width="lg" />
            </CardTitle>
            <CardDescription>
              <TextSkeleton size="sm" width="xl" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skeletonArray(4).map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AvatarSkeleton size="sm" animation="pulse" />
                    <TextSkeleton size="sm" width="md" />
                  </div>
                  <TextSkeleton size="sm" width="xs" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TextSkeleton size="lg" width="lg" />
            </CardTitle>
            <CardDescription>
              <TextSkeleton size="sm" width="xl" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skeletonArray(4).map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <TextSkeleton size="sm" width="md" />
                  <TextSkeleton size="sm" width="xs" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
