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
    <div className="pt-1 px-1 flex items-center gap-1">
      <Input
        placeholder="search history"
        value={filter}
        onChange={handleChange}
      />
      <div>
        <RequestHistoryActions />
      </div>
    </div>
  );
}
