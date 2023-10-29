import { SupportedBodyType } from '@/common/types';
import { BodyTypeDropdown } from './body.type.dropdown';
import { Button } from '@/components/ui/button';
import {
  addFormDataItem,
  selectTextBodyEnabled,
  setEnableTextBody
} from '../redux/request.section.reducer';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BodySectionHeaderProps {
  bodyType: SupportedBodyType;
}

export function BodySectionHeader({ bodyType }: BodySectionHeaderProps) {
  const dispatch = useAppDispatch();
  const enableTextBody = useAppSelector(selectTextBodyEnabled);

  if (['formdata', 'url_encoded'].includes(bodyType)) {
    return (
      <div className="flex items-center justify-between py-2 px-1">
        <BodyTypeDropdown />
        <Button
          variant={'link'}
          size={'icon'}
          onClick={(_) => {
            dispatch(addFormDataItem());
          }}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-between py-2 px-1">
        <BodyTypeDropdown />
        <div className="flex items-center gap-2">
          <Switch
            checked={enableTextBody}
            onCheckedChange={(checked) => {
              dispatch(setEnableTextBody(checked));
            }}
            id="default_headers_switch"
          />
          <Label htmlFor="default_headers_switch">
            {enableTextBody ? 'disable' : 'enable'}
          </Label>
        </div>
      </div>
    );
  }
}
