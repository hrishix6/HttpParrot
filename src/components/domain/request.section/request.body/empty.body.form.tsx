import { Plus } from 'lucide-react';

interface EmptyBodyProps {
  show?: boolean;
}

export function EmptyBody({ show = true }: EmptyBodyProps) {
  if (!show) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
      <p className="text-lg font-semibold p-1 bg-background flex items-center">
        Click <Plus className="text-primary h-5 w-5 mx-1" /> to add fields
      </p>
    </div>
  );
}
