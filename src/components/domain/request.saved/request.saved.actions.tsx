import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '../../../redux/hoooks';
import { deleteSavedRequestsAsync } from '../../../redux/request.saved/request.saved.async.actions';

export function RequestSavedActions() {
  const dispatch = useAppDispatch();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="icon">
          <Settings2 className="h-5 w-5" />
          <span className="sr-only">Saved requests options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => dispatch(deleteSavedRequestsAsync())}>
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
