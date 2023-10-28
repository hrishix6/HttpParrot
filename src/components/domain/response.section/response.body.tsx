import { useAppSelector } from '../../../redux/hoooks';
import {
  selectMimeType,
  selectResponseBody,
  selectResponseBodyLoading,
  selectResponseBodytype
} from '../../../redux/response.section/response.reducer';
import { Spinner } from '@/components/ui/spinner';
import { TextBody } from './text.body';
import { BinaryBody } from './binary.body';
import { EmptyBody } from './empty.body';

export function ResponseBody() {
  const body = useAppSelector(selectResponseBody);
  const mimeType = useAppSelector(selectMimeType);
  const bodytype = useAppSelector(selectResponseBodytype);
  const loading = useAppSelector(selectResponseBodyLoading);

  let bodyCompoent;

  if (body) {
    if (['js', 'css', 'html', 'text', 'xml', 'json'].includes(bodytype)) {
      bodyCompoent = <TextBody bodyType={bodytype} text={body} />;
    } else {
      bodyCompoent = (
        <BinaryBody bodyType={bodytype} mimeType={mimeType} chunks={body} />
      );
    }
  } else {
    bodyCompoent = <EmptyBody />;
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
      {bodyCompoent}
      {loading && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
