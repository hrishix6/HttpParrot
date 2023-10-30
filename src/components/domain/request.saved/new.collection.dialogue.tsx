import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAppDispatch } from '../../../common/hoooks';
import { addNewCollectionAsync } from '../request.saved/redux/request.saved.async.actions';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCollectionDialogue({ onOpenChange, open }: Props) {
  const dispatch = useAppDispatch();
  const [collectionName, setcollectionName] = useState('');

  const handleSaveRequest = () => {
    dispatch(addNewCollectionAsync(collectionName));
    setcollectionName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <DialogDescription>
            Create a new collection to group requests.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={collectionName}
              onChange={(e) => {
                setcollectionName(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={'outline'}
            onClick={() => {
              setcollectionName('');
              onOpenChange(false);
            }}
          >
            Discard
          </Button>
          <Button onClick={handleSaveRequest}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
