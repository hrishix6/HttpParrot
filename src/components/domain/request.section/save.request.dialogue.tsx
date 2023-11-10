import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/common/hoooks';
import {
  selectName,
  selectRequestCollection
} from '../tabs/redux/tabs.reducer';
import { selectCollections } from '../request.saved/redux/request.saved.reducer';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, collectionId: string) => void;
}

export function SaveRequestDialogue({ onOpenChange, open, onSave }: Props) {
  const rName = useAppSelector(selectName);
  const rCollection = useAppSelector(selectRequestCollection);
  const collections = useAppSelector(selectCollections);
  const [requestName, setRequestName] = useState('');
  const [collection, setSelectedCollection] = useState('default');

  useEffect(() => {
    if (rName) {
      setRequestName(rName);
    }
  }, [rName]);

  useEffect(() => {
    if (rCollection) {
      setSelectedCollection(rCollection);
    }
  }, [rCollection]);

  const handleSaveRequest = () => {
    onSave(requestName, collection);
    setRequestName('');
    setSelectedCollection('default');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Request</DialogTitle>
          <DialogDescription>
            Give name to a request, you can refer to it later in saved section.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={requestName}
              onChange={(e) => {
                setRequestName(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Select
              value={collection}
              onValueChange={(e) => {
                console.log(e);
                setSelectedCollection(e);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {collections.map((x) => (
                    <SelectItem key={x.id} value={x.id}>
                      {x.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={'outline'}
            onClick={() => {
              setRequestName('');
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
