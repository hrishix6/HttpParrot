import { Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyBody } from './empty.body.form';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  removeFormDataItem,
  selectFormDataItems,
  updateFormDataItemEnabled,
  updateFormDataItemName,
  updateFormDataItemValue
} from '../redux/request.section.reducer';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

export function FormdataBody() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const formItems = useAppSelector(selectFormDataItems);

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2 relative">
      {formItems.length ? (
        formItems.map((x) => (
          <div className="flex gap-2 items-center" key={x.id}>
            <div>
              <Checkbox
                className="block"
                checked={x.enabled}
                onCheckedChange={(_) => {
                  dispatch(updateFormDataItemEnabled({ id: x.id }));
                }}
              />
            </div>
            <Input
              type="text"
              value={x.name}
              placeholder="name"
              onChange={(e) => {
                dispatch(
                  updateFormDataItemName({ id: x.id, name: e.target.value })
                );
              }}
            />
            <Input
              type="text"
              value={x.value}
              placeholder="value"
              onChange={(e) => {
                dispatch(
                  updateFormDataItemValue({ id: x.id, value: e.target.value })
                );
              }}
            />
            <div>
              <Button
                variant={'link'}
                size={'icon'}
                onClick={(_) => {
                  dispatch(removeFormDataItem(x.id));
                }}
              >
                <Minus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <EmptyBody />
      )}
      <div ref={bottomRef}></div>
    </div>
  );
}
