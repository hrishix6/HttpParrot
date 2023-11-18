import { Plus } from 'lucide-react';

interface EmptyBodyProps {
  show?: boolean;
}

export function EmptyBody({ show = true }: EmptyBodyProps) {
  if (!show) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center">
      <img src="logo.svg" className="h-10 w-10" />
      <p className="text-lg font-semibold p-1 bg-background text-muted-foreground flex items-center">
        Click <Plus className="h-5 w-5 mx-1" /> to add fields
      </p>
    </div>
  );
}
