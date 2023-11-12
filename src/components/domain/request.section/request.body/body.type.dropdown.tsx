import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SupportedBodyType } from '@/common/types';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectBodyType } from '../../tabs/redux/tabs.reducer';
import { setBodyTypeAsync } from '../../tabs/redux/tabs.async.actions';

export function BodyTypeDropdown() {
  const dispatch = useAppDispatch();
  const bodyType = useAppSelector(selectBodyType);

  return (
    <div>
      <Select
        value={bodyType}
        onValueChange={(newVal) => {
          dispatch(setBodyTypeAsync(newVal as SupportedBodyType));
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Body Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={'formdata'} defaultChecked>
              Form-data
            </SelectItem>
            <SelectItem value={'url_encoded'}>Url-Encoded-Form-data</SelectItem>
            <SelectItem value={'json'}>Json</SelectItem>
            <SelectItem value={'xml'}>Xml</SelectItem>
            <SelectItem value={'text'}>Text</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
