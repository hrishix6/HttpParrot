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
import { selectBodyType, setBodyType } from '../redux/request.section.reducer';

export function BodyTypeDropdown() {
  const dispatch = useAppDispatch();
  const bodyType = useAppSelector(selectBodyType);

  return (
    <div>
      <Select
        value={bodyType}
        onValueChange={(newVal) => {
          dispatch(setBodyType(newVal as SupportedBodyType));
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
            <SelectItem value={'url_encoded'} defaultChecked>
              Url-Encoded-Form-data
            </SelectItem>
            <SelectItem value={'json'} defaultChecked>
              Json
            </SelectItem>
            <SelectItem value={'xml'} defaultChecked>
              Xml
            </SelectItem>
            <SelectItem value={'text'} defaultChecked>
              Text
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
