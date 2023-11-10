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
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  clearRequestSectionAsync,
  generateCodeSnippetAsync
} from '../tabs/redux/tabs.async.actions';
import {
  selectActiveTab,
  selectRequestCollection
} from '../tabs/redux/tabs.reducer';
import {
  saveRequestAsync,
  saveRequestCopyAsync
} from '../request.saved/redux/request.saved.async.actions';

export function RequestActionsDropDown() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const rCollection = useAppSelector(selectRequestCollection);
  const [opensaveDialogue, setopensaveDialogue] = useState(false);
  const [opensaveAsDialogue, setopensaveAsDialogue] = useState(false);

  const handleSaveDialogueVisible = (open: boolean) => {
    setopensaveDialogue(open);
  };

  const handleSaveAsDialogueVisible = (open: boolean) => {
    setopensaveAsDialogue(open);
  };

  const handleSaveDispatch = (requestName: string, collectionId: string) => {
    dispatch(
      saveRequestAsync({
        name: requestName,
        collectionId,
        tabId: activeTab
      })
    );
  };

  const handleSaveAsDispatch = (requestName: string, collectionId: string) => {
    dispatch(
      saveRequestCopyAsync({
        name: requestName,
        collectionId,
        tabId: activeTab
      })
    );
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
                handleSaveDialogueVisible(true);
              }}
            >
              <span>Save</span>
            </DropdownMenuItem>
            {rCollection !== '' ? (
              <DropdownMenuItem
                onClick={() => {
                  handleSaveAsDialogueVisible(true);
                }}
              >
                <span>Save as</span>
              </DropdownMenuItem>
            ) : (
              <></>
            )}
            <DropdownMenuItem
              onClick={() => {
                console.log('clearing request form');
                dispatch(clearRequestSectionAsync());
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
      <SaveRequestDialogue
        open={opensaveDialogue}
        onOpenChange={handleSaveDialogueVisible}
        onSave={handleSaveDispatch}
      />
      <SaveRequestDialogue
        open={opensaveAsDialogue}
        onOpenChange={handleSaveAsDialogueVisible}
        onSave={handleSaveAsDispatch}
      />
    </>
  );
}
