import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SaveRequestDialogue } from './save.request.dialogue';
import { useState } from 'react';
import { useAppDispatch } from '../../../common/hoooks';
import { clearRequestSection } from './redux/request.section.reducer';

export function RequestActionsDropDown() {
  const dispatch = useAppDispatch();
  const [open, setopen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setopen(open);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="border-solid border-l">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Request actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              handleOpenChange(true);
            }}
          >
            Save
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              console.log('clearing request form');
              dispatch(clearRequestSection());
            }}
          >
            Clear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SaveRequestDialogue open={open} onOpenChange={handleOpenChange} />
    </>
  );
}
