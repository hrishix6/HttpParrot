import { Bird } from 'lucide-react';

export function EmptyTabsPlaceholder() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 items-center justify-center p-4">
      <Bird className="text-primary h-10 w-10" />
      <h2 className="text-xl text-muted-foreground">
        This is your working area, create a new request or open saved one.
      </h2>
    </div>
  );
}
