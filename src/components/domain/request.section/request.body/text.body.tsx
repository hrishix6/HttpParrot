import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectBodyType, selectTextBody } from '../../tabs/redux/tabs.reducer';
import { setTextBodyAsync } from '../../tabs/redux/tabs.async.actions';
import { CodeEditor } from '@/components/ui/editor';

export function TextBody() {
  const dispatch = useAppDispatch();
  const bodyType = useAppSelector(selectBodyType);
  const text = useAppSelector(selectTextBody);

  const handleTextBodyChange = (text: string) => {
    dispatch(setTextBodyAsync(text));
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto gap-2 p-2 relative">
      <div className="flex-1">
        <CodeEditor
          bodyType={bodyType}
          text={text}
          onChange={handleTextBodyChange}
        />
      </div>
    </div>
  );
}
