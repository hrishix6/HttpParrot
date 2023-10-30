import { ChevronDown, SendIcon, Code } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SaveRequestDialogue } from './save.request.dialogue';
import { useState } from 'react';
import { useAppDispatch } from '../../../common/hoooks';
import { clearRequestSection } from './redux/request.section.reducer';
import { generateCodeSnippetAsync } from './redux/request.async.actions';

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
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Request actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="flex items-center gap-2">
            <SendIcon className="h-4 w-4" />
            <span>Request</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                handleOpenChange(true);
              }}
            >
              <span>Save</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log('clearing request form');
                dispatch(clearRequestSection());
              }}
            >
              <span>Clear</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Code snippets</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                dispatch(generateCodeSnippetAsync('curl'));
              }}
            >
              Curl
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                dispatch(generateCodeSnippetAsync('js'));
              }}
            >
              Fetch
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <SaveRequestDialogue open={open} onOpenChange={handleOpenChange} />
    </>
  );
}
