import { HighlightedInput } from '@/components/ui/highlighted-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  selectTokenPrefix,
  selectTokenValue
} from '../../tabs/redux/tabs.reducer';
import {
  setTokenPrefixAsync,
  setTokenValueAsync
} from '../../tabs/redux/tabs.async.actions';

export function TokenAuth() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectTokenValue);
  const prefix = useAppSelector(selectTokenPrefix);

  return (
    <section className="flex-1 flex flex-col gap-4 overflow-y-auto py-2 px-1">
      <div className="flex flex-col gap-3">
        <Label htmlFor="token_auth_prefix">Token Prefix</Label>
        <div className="h-10">
          <HighlightedInput
            id="token_auth_prefix"
            onBlur={() => {}}
            onChange={(e) => dispatch(setTokenPrefixAsync(e.target.value))}
            placeholder="Bearer"
            value={prefix}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="token_auth_token">Token</Label>
        <Textarea
          rows={4}
          id="token_auth_token"
          placeholder="token"
          value={token}
          onChange={(e) => dispatch(setTokenValueAsync(e.target.value))}
        />
      </div>
    </section>
  );
}
