import {
  FormDataItem,
  UpdateEditableItemEnabled,
  UpdateEditableItemName,
  UpdateEditableItemValue
} from '@/common/types';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Minus } from 'lucide-react';
import { HighlightedInput } from '@/components/ui/highlighted-input';

interface RequestQueryItemProps {
  model: FormDataItem;
  onEnabledChange: (arg: UpdateEditableItemEnabled) => void;
  onNameChange: (arg: UpdateEditableItemName) => void;
  onValueChange: (arg: UpdateEditableItemValue) => void;
  onRemoveItem: (id: string) => void;
}

export function RequestFormDataItem({
  model,
  onEnabledChange,
  onNameChange,
  onRemoveItem,
  onValueChange
}: RequestQueryItemProps) {
  const { id, enabled, name, value } = model;

  function handleEnabledChange(_: CheckedState) {
    onEnabledChange({ id });
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    onNameChange({ id: id, name: e.target.value });
  }

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    onValueChange({ id: id, value: e.target.value });
  }

  function handleRemoveItem(_: React.MouseEvent<HTMLButtonElement>) {
    onRemoveItem(id);
  }

  return (
    <div className="flex gap-2 items-center">
      <div>
        <Checkbox
          className="block"
          checked={enabled}
          onCheckedChange={handleEnabledChange}
        />
      </div>
      <HighlightedInput
        onBlur={() => {}}
        onChange={handleNameChange}
        placeholder="name"
        value={name}
      />
      <HighlightedInput
        onBlur={() => {}}
        onChange={handleValueChange}
        placeholder="value"
        value={value}
      />
      <div>
        <Button variant={'link'} size={'icon'} onClick={handleRemoveItem}>
          <Minus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
