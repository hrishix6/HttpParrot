import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  selectQuery,
  addQueryItem,
  updateQueryItemEnabled,
  updateQueryItemName,
  updateQueryItemValue,
  removeQueryItem
} from './redux/request.section.reducer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { RequestFormDataItem } from './request.data.item';
import {
  UpdateFormDataItemEnabled,
  UpdateFormDataItemName,
  UpdateFormDataItemValue
} from '@/common/types';

function EmptyQueryParamsMessage() {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
      <p className="text-lg text-muted-foreground font-semibold p-1 bg-background flex items-center">
        Click <Plus className="text-primary h-5 w-5 mx-1" /> to add query params
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

  const onEnabledChange = (arg: UpdateFormDataItemEnabled) => {
    dispatch(updateQueryItemEnabled(arg));
  };
  const onNameChange = (arg: UpdateFormDataItemName) => {
    dispatch(updateQueryItemName(arg));
  };
  const onValueChange = (arg: UpdateFormDataItemValue) => {
    dispatch(updateQueryItemValue(arg));
  };
  const onRemoveItem = (id: string) => {
    dispatch(removeQueryItem(id));
  };

  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg">Query Parameters</h3>
        <Button
          variant={'link'}
          size={'icon'}
          onClick={(_) => {
            dispatch(addQueryItem(null));
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
