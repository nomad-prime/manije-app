import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const JobCardSkeleton = () => {
  return (
    <Card className="h-full bg-input/30 animate-pulse">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-2/3 rounded" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/2 mt-2 rounded" />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {[1, 2].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-20 w-full rounded" />
          </div>
        ))}
      </CardContent>

      <CardFooter className="px-6 pb-4">
        <Skeleton className="h-4 w-24 rounded" />
      </CardFooter>
    </Card>
  );
};

export default JobCardSkeleton;
