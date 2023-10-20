import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

interface RequestSavedFilterProps {
  filter: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RequestSavedFilter({
  filter,
  handleChange
}: RequestSavedFilterProps) {
  return (
    <div className="pl-1 pt-1 flex gap-2">
      <Input
        placeholder="search collection"
        value={filter}
        onChange={handleChange}
      />
      <Button variant={'ghost'} size={'icon'}>
        <Settings2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
