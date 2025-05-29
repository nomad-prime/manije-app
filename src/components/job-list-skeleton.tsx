import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobListSkeleton() {
  return (
    <ScrollArea className="max-w-60 border-r">
      <div className="p-2 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            className="w-full justify-start text-left hover:bg-muted relative group"
            disabled
          >
            <Skeleton className="inline-block mr-2 h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32 rounded" />
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
