import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, FolderDown } from 'lucide-react';
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
import { useStore } from 'react-redux';
import { RootState } from '@/common/store';
import {
  exportToFile,
  toExportedCollectionModel
} from '@/lib/import.export.utils';
import { deleteCollectionAsync } from './redux/request.saved.async.actions';
interface CollectionActionsProps {
  model: RequestCollectionModel;
}

export function CollectionActions({ model }: CollectionActionsProps) {
  const dispatch = useAppDispatch();
  const store = useStore();
  const [openEditCollectionDialogue, setopenEditCollectionDialogue] =
    useState(false);

  const handleOpenEditCollectionDialogue = (open: boolean) => {
    dispatch(populateForm({ model, mode: 'update' }));
    setopenEditCollectionDialogue(open);
  };

  const handleCollectionDelete = () => {
    dispatch(deleteCollectionAsync(model.id));
  };

  const handleExport = () => {
    console.log('wtffff');
    const rootState = store.getState() as RootState;
    const collection = rootState.savedRequestsStore.collections.find(
      (x) => x.id === model.id
    );
    if (collection) {
      const requests = rootState.savedRequestsStore.saved.filter(
        (x) => x.collectionId == collection.id
      );
      console.log(`exporting collection ${collection.name}...`);
      const modelToExport = toExportedCollectionModel(collection, requests);
      exportToFile(
        JSON.stringify(modelToExport),
        collection.name,
        'application/json',
        'json'
      );
    } else {
      //TODO show user error.
      console.log('collection not found');
    }
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
          <DropdownMenuItem
            onClick={() => handleOpenEditCollectionDialogue(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport()}>
            <FolderDown className="h-4 w-4 mr-2" />
            <span>Export</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={model.id === 'default'}
            onClick={() => {
              handleCollectionDelete();
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
