
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function ManagementSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardHeader className="space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-12" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-0 pb-2">
          <Skeleton className="h-6 w-full" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}