import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectQuery } from '../tabs/redux/tabs.reducer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { RequestFormDataItem } from './request.data.item';
import {
  UpdateEditableItemEnabled,
  UpdateEditableItemName,
  UpdateEditableItemValue
} from '@/common/types';
import {
  addQueryItemAsync,
  removeQueryItemAsync,
  updateQueryItemEnabledAsync,
  updateQueryItemNameAsync,
  updateQueryItemValueAsync
} from '../tabs/redux/tabs.async.actions';

function EmptyQueryParamsMessage() {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center">
      <img src="logo.svg" className="h-10 w-10" />
      <p className="text-lg text-muted-foreground font-semibold p-1 bg-background flex items-center">
        Click <Plus className="h-5 w-5 mx-1" /> to add query params
      </p>
    </div>
  );
}

export function RequestQuery() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const query = useAppSelector(selectQuery);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [query]);

  const onEnabledChange = (arg: UpdateEditableItemEnabled) => {
    dispatch(updateQueryItemEnabledAsync(arg));
  };
  const onNameChange = (arg: UpdateEditableItemName) => {
    dispatch(updateQueryItemNameAsync(arg));
  };
  const onValueChange = (arg: UpdateEditableItemValue) => {
    dispatch(updateQueryItemValueAsync(arg));
  };
  const onRemoveItem = (id: string) => {
    dispatch(removeQueryItemAsync(id));
  };

  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between py-1 px-2">
        <h3 className="text-lg self-start">Query Parameters</h3>
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={(_) => {
            dispatch(addQueryItemAsync());
          }}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2 relative">
        {query.length ? (
          query.map((x) => (
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
          <EmptyQueryParamsMessage />
        )}
        <div ref={bottomRef}></div>
      </div>
    </section>
  );
}
