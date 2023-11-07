import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectHeaders } from '../tabs/redux/tabs.reducer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ImmutableHeaders } from './immutable.headers';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  UpdateHeaderEnabled,
  UpdateHeaderName,
  UpdateHeaderValue
} from '@/common/types';
import { RequestFormDataItem } from './request.data.item';
import {
  addHeaderAsync,
  removeHeaderAsync,
  updateHeaderEnabledAsync,
  updateHeaderNameAsync,
  updateHeaderValueAsync
} from '../tabs/redux/tabs.async.actions';

export function RequestHeaders() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const headers = useAppSelector(selectHeaders);
  const [showDefaultHeaders, setShowDefaultHeaders] = useState<boolean>(() => {
    const saved = localStorage.getItem(`show-default-headers`);
    return saved === 'true';
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    localStorage.setItem(`show-default-headers`, `${showDefaultHeaders}`);
  }, [showDefaultHeaders]);

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [headers]);

  const onEnabledChange = (arg: UpdateHeaderEnabled) => {
    dispatch(updateHeaderEnabledAsync(arg));
  };
  const onNameChange = (arg: UpdateHeaderName) => {
    dispatch(updateHeaderNameAsync(arg));
  };
  const onValueChange = (arg: UpdateHeaderValue) => {
    dispatch(updateHeaderValueAsync(arg));
  };
  const onRemoveItem = (id: string) => {
    dispatch(removeHeaderAsync(id));
  };

  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg">HTTP Headers</h3>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2">
            <Switch
              checked={showDefaultHeaders}
              onCheckedChange={(checked) => {
                setShowDefaultHeaders(checked);
              }}
              id="default_headers_switch"
            />
            <Label htmlFor="default_headers_switch">
              {showDefaultHeaders
                ? 'hide default headers'
                : 'show default headers'}
            </Label>
          </div>
          <Button
            variant={'link'}
            size={'icon'}
            onClick={(_) => {
              dispatch(addHeaderAsync());
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2 relative">
        <ImmutableHeaders show={showDefaultHeaders} />
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
          <></>
        )}
        <div ref={bottomRef}></div>
      </div>
    </section>
  );
}
