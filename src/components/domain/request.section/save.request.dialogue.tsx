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
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../common/hoooks';
import { saveRequestAsync } from '../request.saved/redux/request.saved.async.actions';
import { selectName } from './redux/request.section.reducer';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveRequestDialogue({ onOpenChange, open }: Props) {
  const name = useAppSelector(selectName);
  const dispatch = useAppDispatch();
  const [requestName, setRequestName] = useState('');

  useEffect(() => {
    console.log(`name from form- ${name}`);
    if (name) {
      setRequestName(name);
    }
  }, [name]);

  const handleSaveRequest = () => {
    dispatch(saveRequestAsync(requestName));
    setRequestName('');
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
            <Label htmlFor="collection">Collection</Label>
            <Input id="collection" type="text" disabled value={'default'} />
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
