import { SupportedBodyType } from '@/common/types';
import { BodyTypeDropdown } from './body.type.dropdown';
import { Button } from '@/components/ui/button';
import { selectTextBodyEnabled } from '../../tabs/redux/tabs.reducer';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  addFormDataItemAsync,
  formatTextBodyAsync,
  setEnableTextBodyAsync
} from '../../tabs/redux/tabs.async.actions';

interface BodySectionHeaderProps {
  bodyType: SupportedBodyType;
}

export function BodySectionHeader({ bodyType }: BodySectionHeaderProps) {
  const dispatch = useAppDispatch();
  const enableTextBody = useAppSelector(selectTextBodyEnabled);

  if (['formdata', 'url_encoded'].includes(bodyType)) {
    return (
      <div className="flex items-center justify-between py-1 px-2">
        <p className="text-lg self-start">Request Body</p>
        <div className="flex items-center gap-3">
          <BodyTypeDropdown />
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={(_) => {
              dispatch(addFormDataItemAsync());
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-between py-1 px-2">
        <p className="text-lg self-start">Request Body</p>
        <div className="flex items-center gap-3">
          <BodyTypeDropdown />
          <Button
            variant={'outline'}
            onClick={() => {
              dispatch(formatTextBodyAsync());
            }}
          >
            Prettify
          </Button>
          <Switch
            checked={enableTextBody}
            onCheckedChange={(checked) => {
              dispatch(setEnableTextBodyAsync(checked));
            }}
            id="default_headers_switch"
          />
        </div>
      </div>
    );
  }
}
