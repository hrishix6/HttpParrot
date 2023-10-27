import { Input } from '@/components/ui/input';
import { RequestSavedActions } from './request.saved.actions';

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
      <RequestSavedActions />
    </div>
  );
}
