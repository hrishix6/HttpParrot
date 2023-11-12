import { SupportedAuthType } from '@/common/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAppDispatch } from '@/common/hoooks';
import { setAuthTypeAsync } from '../../tabs/redux/tabs.async.actions';

interface Props {
  authType: SupportedAuthType;
}

export function AuthSectionHeader({ authType }: Props) {
  const dispatch = useAppDispatch();

  let authHeader;
  switch (authType) {
    case 'basic':
      authHeader = 'Basic Authentication';
      break;
    case 'token':
      authHeader = 'Token Authentication';
      break;
    case 'none':
    default:
      authHeader = 'No Authentication';
      break;
  }

  return (
    <section className="px-2 mt-1 flex items-center justify-between">
      <p className="text-lg self-start">{authHeader}</p>
      <div>
        <Select
          value={authType}
          onValueChange={(newVal) => {
            dispatch(setAuthTypeAsync(newVal as SupportedAuthType));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Auth type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'none'} defaultChecked>
              None
            </SelectItem>
            <SelectItem value={'basic'} defaultChecked>
              Basic
            </SelectItem>
            <SelectItem value={'token'} defaultChecked>
              Token
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
