import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus, FolderUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { NewCollectionDialogue } from './new.collection.dialogue';
import { ImportCollectionDialogue } from './import.collection.dialogue';

export function RequestSavedActions() {
  const [openNewCollectionD, setopenNewCollectionD] = useState(false);
  const [openImportCollectionD, setopenImportCollectionD] = useState(false);

  const handleOpenNewCollectionD = (open: boolean) => {
    setopenNewCollectionD(open);
  };

  const handleOpenImportCollectionD = (open: boolean) => {
    setopenImportCollectionD(open);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} size={'icon'}>
            <Settings2 className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenImportCollectionD(true)}>
            <FolderUp className="h-4 w-4 mr-2" />
            <span>Import Collection</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenNewCollectionD(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <span>New Collection</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewCollectionDialogue
        open={openNewCollectionD}
        onOpenChange={handleOpenNewCollectionD}
      />
      <ImportCollectionDialogue
        open={openImportCollectionD}
        onOpenChange={handleOpenImportCollectionD}
      />
    </>
  );
}
