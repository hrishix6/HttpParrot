import { EmptyBody } from './empty.body.form';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectFormDataItems } from '../../tabs/redux/tabs.reducer';
import { RequestFormDataItem } from '../request.data.item';
import {
  UpdateFormDataItemEnabled,
  UpdateFormDataItemName,
  UpdateFormDataItemValue
} from '@/common/types';
import {
  removeFormDataItemAsync,
  updateFormDataItemEnabledAsync,
  updateFormDataItemNameAsync,
  updateFormDataItemValueAsync
} from '../../tabs/redux/tabs.async.actions';

export function FormdataBody() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const formItems = useAppSelector(selectFormDataItems);

  const onEnabledChange = (arg: UpdateFormDataItemEnabled) => {
    dispatch(updateFormDataItemEnabledAsync(arg));
  };
  const onNameChange = (arg: UpdateFormDataItemName) => {
    dispatch(updateFormDataItemNameAsync(arg));
  };
  const onValueChange = (arg: UpdateFormDataItemValue) => {
    dispatch(updateFormDataItemValueAsync(arg));
  };
  const onRemoveItem = (id: string) => {
    dispatch(removeFormDataItemAsync(id));
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
