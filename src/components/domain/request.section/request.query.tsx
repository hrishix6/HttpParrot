import { useAppDispatch, useAppSelector } from '../../../redux/hoooks';
import {
  selectQuery,
  addQueryItem,
  removeQueryItem,
  updateQueryItemEnabled,
  updateQueryItemName,
  updateQueryItemValue
} from '../../../redux/request.section/request.section.reducer';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function RequestQuery() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const query = useAppSelector(selectQuery);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [query]);

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
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2">
        {query.map((x) => (
          <div className="flex gap-2 items-center" key={x.id}>
            <div>
              <Checkbox
                className="block"
                checked={x.enabled}
                onCheckedChange={(_) => {
                  dispatch(updateQueryItemEnabled({ id: x.id }));
                }}
              />
            </div>
            <Input
              type="text"
              value={x.name}
              placeholder="name"
              onChange={(e) => {
                dispatch(
                  updateQueryItemName({ id: x.id, name: e.target.value })
                );
              }}
            />
            <Input
              type="text"
              value={x.value}
              placeholder="value"
              onChange={(e) => {
                dispatch(
                  updateQueryItemValue({ id: x.id, value: e.target.value })
                );
              }}
            />
            <div>
              <Button
                variant={'link'}
                size={'icon'}
                onClick={(_) => {
                  dispatch(removeQueryItem(x.id));
                }}
              >
                <Minus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
    </section>
  );
}