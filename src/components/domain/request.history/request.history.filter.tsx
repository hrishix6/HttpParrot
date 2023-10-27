import { Input } from '@/components/ui/input';
import { RequestHistoryActions } from './request.history.actions';

interface RequestHistoryFilterProps {
  filter: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RequestHistoryFilter({
  filter,
  handleChange
}: RequestHistoryFilterProps) {
  return (
    <div className="pl-1 pt-1 flex gap-2">
      <Input
        placeholder="search history"
        value={filter}
        onChange={handleChange}
      />
      <RequestHistoryActions />
    </div>
  );
}
