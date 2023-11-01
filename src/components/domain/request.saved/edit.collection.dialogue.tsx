import * as Dialog from '@radix-ui/react-dialog';
import { Minus, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { useEffect, useRef, useState } from 'react';
import {
  addVariable,
  removeVariable,
  resetForm,
  selectCollectionFormName,
  selectCollectionFormVariables,
  updateVariableName,
  updateVariableValue
} from './redux/collection.form.reducer';
import { saveCollectionAsync } from './redux/collection.form.async.actions';

interface EditCollectionDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EmptyVariablesMessage() {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
      <p className="text-lg text-muted-foreground font-semibold p-1 bg-background flex items-center">
        Click <Plus className="text-primary h-5 w-5 mx-1" /> to add variables.
      </p>
    </div>
  );
}

export function EditCollectionDialogue({
  open,
  onOpenChange
}: EditCollectionDialogueProps) {
  const bottomref = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const rCollectionName = useAppSelector(selectCollectionFormName);
  const rCollectionVariables = useAppSelector(selectCollectionFormVariables);
  const [collectionName, setcollectionName] = useState('');

  useEffect(() => {
    if (open) {
      setcollectionName(rCollectionName);
    }
  }, [rCollectionName, open]);

  useEffect(() => {
    bottomref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rCollectionVariables]);

  const handleSaveCollection = () => {
    dispatch(saveCollectionAsync(collectionName));
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed overflow-hidden inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-[50%] flex flex-col gap-3 left-[50%] w-11/12 h-4/5 md:w-2/3 overflow-hidden translate-x-[-50%] translate-y-[-50%] z-50 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
            Editing Collection -{' '}
            <span className="text-primary">{rCollectionName}</span>
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground">
            Make changes to the collection here. Click save when you're done.
          </Dialog.Description>
          <section className="flex-1 flex flex-col gap-4 text-xl overflow-hidden h-full">
            <div className="flex flex-col gap-4 mt-4 px-1">
              <Label htmlFor="collection_name">Collection Name</Label>
              <Input
                id="collection_name"
                type="text"
                value={collectionName}
                onChange={(e) => setcollectionName(e.target.value)}
                placeholder="name"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
              <div className="flex justify-between items-center px-2">
                <p className="text-base font-semibold">Variables</p>
                <Button
                  variant={'link'}
                  size={'icon'}
                  onClick={(_) => {
                    dispatch(addVariable(null));
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 flex flex-col gap-3 p-2 overflow-y-auto relative">
                {rCollectionVariables.length ? (
                  rCollectionVariables.map((x) => (
                    <div
                      className="flex gap-2 items-center pb-2 md:pb-0"
                      key={x.id}
                    >
                      <div className="flex flex-1 gap-2 flex-col items-center md:flex-row">
                        <Input
                          type="text"
                          value={x.name}
                          placeholder="name"
                          onChange={(e) => {
                            dispatch(
                              updateVariableName({
                                id: x.id,
                                name: e.target.value
                              })
                            );
                          }}
                        />
                        <Input
                          type="text"
                          value={x.value}
                          placeholder="value"
                          onChange={(e) => {
                            dispatch(
                              updateVariableValue({
                                id: x.id,
                                value: e.target.value
                              })
                            );
                          }}
                        />
                      </div>
                      <div>
                        <Button
                          variant={'link'}
                          size={'icon'}
                          onClick={(_) => {
                            dispatch(removeVariable(x.id));
                          }}
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyVariablesMessage />
                )}
                <div ref={bottomref}></div>
              </div>
            </div>
          </section>
          <div className="flex flex-row-reverse gap-2">
            <Button onClick={handleSaveCollection}>Save</Button>
            <Button
              variant={'outline'}
              onClick={() => {
                dispatch(resetForm());
                onOpenChange(false);
              }}
            >
              Discard
            </Button>
          </div>
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
