import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useAppDispatch } from '@/common/hoooks';
import { populateForm } from './redux/collection.form.reducer';
import { RequestCollectionModel } from '@/common/types';
import { EditCollectionDialogue } from './edit.collection.dialogue';

interface CollectionActionsProps {
  model: RequestCollectionModel;
}

export function CollectionActions({ model }: CollectionActionsProps) {
  const dispatch = useAppDispatch();
  const [openEditCollectionDialogue, setopenEditCollectionDialogue] =
    useState(false);
  //   const [openDeleteCollectionDialogue, setopenDeleteCollectionDialogue] =
  //     useState(false);

  const handleOpenEditCollectionDialogue = (open: boolean) => {
    dispatch(populateForm({ model, mode: 'update' }));
    setopenEditCollectionDialogue(open);
  };

  //   const handleOpenDeleteCollectionDialogue = (open: boolean) => {
  //     setopenDeleteCollectionDialogue(open);
  //   };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon">
            <Settings2 className="h-5 w-5" />
            <span className="sr-only">Collection actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleOpenEditCollectionDialogue(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              /*handleOpenDeleteCollectionDialogue(true)*/
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditCollectionDialogue
        onOpenChange={handleOpenEditCollectionDialogue}
        open={openEditCollectionDialogue}
      />
    </>
  );
}
