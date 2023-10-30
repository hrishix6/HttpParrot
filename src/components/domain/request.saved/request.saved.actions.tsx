import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { NewCollectionDialogue } from './new.collection.dialogue';

export function RequestSavedActions() {
  const [open, setopen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setopen(open);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon">
            <Settings2 className="h-5 w-5" />
            <span className="sr-only">Saved requests options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenChange(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <span>New Collection</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewCollectionDialogue open={open} onOpenChange={handleOpenChange} />
    </>
  );
}
