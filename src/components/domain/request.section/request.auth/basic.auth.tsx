import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  selectBasicAuthPass,
  selectBasicAuthUser
} from '../../tabs/redux/tabs.reducer';
import {
  setBasicAuthPasswordAsync,
  setBasicAuthUsernameAsync
} from '../../tabs/redux/tabs.async.actions';
import { HighlightedInput } from '@/components/ui/highlighted-input';

export function BasicAuth() {
  const dispatch = useAppDispatch();
  const username = useAppSelector(selectBasicAuthUser);
  const password = useAppSelector(selectBasicAuthPass);

  return (
    <section className="flex-1 flex flex-col gap-3 overflow-y-auto py-2">
      <div className="flex flex-col gap-4 md:flex-row md:gap-2 px-1">
        <div className="flex flex-col md:flex-1 gap-3">
          <Label htmlFor="basic_auth_uname">Username</Label>
          <div className="h-10">
            <HighlightedInput
              id="basic_auth_uname"
              onBlur={() => {}}
              onChange={(e) =>
                dispatch(setBasicAuthUsernameAsync(e.target.value))
              }
              placeholder=""
              value={username}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-1 gap-3">
          <Label htmlFor="basic_auth_pass">Password</Label>
          <div className="h-10">
            <HighlightedInput
              id="basic_auth_pass"
              onBlur={() => {}}
              onChange={(e) =>
                dispatch(setBasicAuthPasswordAsync(e.target.value))
              }
              placeholder=""
              value={password}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
