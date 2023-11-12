import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/common/hoooks';
import { importCollectionAsync } from './redux/request.saved.async.actions';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportCollectionDialogue({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      onOpenChange(false);
      return;
    }

    if (file.type !== 'application/json') {
      onOpenChange(false);
      return;
    }

    const fr = new FileReader();

    fr.onload = function (ev) {
      const contents = ev.target?.result;
      dispatch(importCollectionAsync(contents));
      onOpenChange(false);
    };
    fr.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Collection</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Input
              id="import_collection_file"
              type="file"
              onChange={handleFileImport}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
