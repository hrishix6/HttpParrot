import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  addHeader,
  updateHeaderEnabled,
  updateHeaderName,
  updateHeaderValue,
  selectHeaders,
  removeHeader
} from './redux/request.section.reducer';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ImmutableHeaders } from './immutable.headers';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function RequestHeaders() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const headers = useAppSelector(selectHeaders);
  const [showDefaultHeaders, setShowDefaultHeaders] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [headers]);

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
              dispatch(addHeader(null));
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
            <div className="flex gap-2 items-center" key={x.id}>
              <div>
                <Checkbox
                  className="block"
                  checked={x.enabled}
                  onCheckedChange={(_) => {
                    dispatch(updateHeaderEnabled({ id: x.id }));
                  }}
                />
              </div>
              <Input
                type="text"
                value={x.name}
                placeholder="name"
                onChange={(e) => {
                  dispatch(
                    updateHeaderName({ id: x.id, name: e.target.value })
                  );
                }}
              />
              <Input
                type="text"
                value={x.value}
                placeholder="value"
                onChange={(e) => {
                  dispatch(
                    updateHeaderValue({ id: x.id, value: e.target.value })
                  );
                }}
              />
              <div>
                <Button
                  variant={'link'}
                  size={'icon'}
                  onClick={(_) => {
                    dispatch(removeHeader(x.id));
                  }}
                >
                  <Minus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
        <div ref={bottomRef}></div>
      </div>
    </section>
  );
}
