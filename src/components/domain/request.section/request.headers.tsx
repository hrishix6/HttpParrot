import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectHeaders } from '../tabs/redux/tabs.reducer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { RequestFormDataItem } from './request.data.item';
import {
  addHeaderAsync,
  removeHeaderAsync,
  updateHeaderEnabledAsync,
  updateHeaderNameAsync,
  updateHeaderValueAsync
} from '../tabs/redux/tabs.async.actions';
import {
  UpdateEditableItemEnabled,
  UpdateEditableItemName,
  UpdateEditableItemValue
} from '@/common/types';

function EmptyHeadersMessage() {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center">
      <img src="logo.svg" className="h-10 w-10" />
      <p className="text-lg text-muted-foreground font-semibold p-1 bg-background flex items-center">
        Click <Plus className="h-5 w-5 mx-1" /> to add headers
      </p>
    </div>
  );
}

export function RequestHeaders() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const headers = useAppSelector(selectHeaders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [headers]);

  const onEnabledChange = (arg: UpdateEditableItemEnabled) => {
    dispatch(updateHeaderEnabledAsync(arg));
  };
  const onNameChange = (arg: UpdateEditableItemName) => {
    dispatch(updateHeaderNameAsync(arg));
  };
  const onValueChange = (arg: UpdateEditableItemValue) => {
    dispatch(updateHeaderValueAsync(arg));
  };
  const onRemoveItem = (id: string) => {
    dispatch(removeHeaderAsync(id));
  };

  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between py-1 px-2">
        <h3 className="text-lg self-start">HTTP Headers</h3>
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={(_) => {
            dispatch(addHeaderAsync());
          }}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2 relative">
        {headers.length ? (
          headers.map((x) => (
            <RequestFormDataItem
              onValueChange={onValueChange}
              onRemoveItem={onRemoveItem}
              onEnabledChange={onEnabledChange}
              onNameChange={onNameChange}
              model={x}
              key={x.id}
            />
          ))
        ) : (
          <EmptyHeadersMessage />
        )}
        <div ref={bottomRef}></div>
      </div>
    </section>
  );
}
