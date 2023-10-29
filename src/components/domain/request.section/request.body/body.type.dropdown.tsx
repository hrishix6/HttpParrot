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
            <SelectItem value="formdata" defaultChecked>
              Formdata
            </SelectItem>
            <SelectItem value="json">Json</SelectItem>
            <SelectItem value="url_encoded">URL Encoded</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
