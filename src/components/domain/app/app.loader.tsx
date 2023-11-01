import { BirdIcon } from 'lucide-react';

export function AppLoader() {
  return (
    <div className="fixed flex items-center justify-center bg-background top-0 left-0 h-full w-full text-primary">
      <BirdIcon className="h-10 w-10 animate-bounce" />
    </div>
  );
}
