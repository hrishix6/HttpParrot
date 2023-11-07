import { BirdIcon } from 'lucide-react';

export function AppError() {
  return (
    <div className="fixed flex flex-col gap-2 items-center justify-center bg-background top-0 left-0 h-full w-full text-destructive">
      <BirdIcon className="h-24 w-24 animate-bounce" />
      <h3>Oops, Something isn't right.</h3>
    </div>
  );
}
