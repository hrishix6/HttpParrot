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
    <div className="pt-1 px-1 flex items-center gap-1">
      <Input
        placeholder="search collection"
        value={filter}
        onChange={handleChange}
      />
      <div>
        <RequestSavedActions />
      </div>
    </div>
  );
}
