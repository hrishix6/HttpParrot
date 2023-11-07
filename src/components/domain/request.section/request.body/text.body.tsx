import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectBodyType, selectTextBody } from '../../tabs/redux/tabs.reducer';
import { setTextBodyAsync } from '../../tabs/redux/tabs.async.actions';

export function TextBody() {
  const dispatch = useAppDispatch();
  const bodyType = useAppSelector(selectBodyType);
  const text = useAppSelector(selectTextBody);

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2 relative">
      <Textarea
        rows={100}
        value={text}
        onChange={(e) => {
          dispatch(setTextBodyAsync(e.target.value));
        }}
        placeholder={`${bodyType} body`}
      />
    </div>
  );
}
