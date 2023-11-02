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
import { RequestFormDataItem } from '../request.data.item';
import {
  UpdateFormDataItemEnabled,
  UpdateFormDataItemName,
  UpdateFormDataItemValue
} from '@/common/types';

export function FormdataBody() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const formItems = useAppSelector(selectFormDataItems);

  const onEnabledChange = (arg: UpdateFormDataItemEnabled) => {
    dispatch(updateFormDataItemEnabled(arg));
  };
  const onNameChange = (arg: UpdateFormDataItemName) => {
    dispatch(updateFormDataItemName(arg));
  };
  const onValueChange = (arg: UpdateFormDataItemValue) => {
    dispatch(updateFormDataItemValue(arg));
  };
  const onRemoveItem = (id: string) => {
    dispatch(removeFormDataItem(id));
  };

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2 relative">
      {formItems.length ? (
        formItems.map((x) => (
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
        <EmptyBody />
      )}
      <div ref={bottomRef}></div>
    </div>
  );
}
