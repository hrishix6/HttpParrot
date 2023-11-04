import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  selectMimeType,
  selectResponseBody,
  selectResponseBodytype
} from './redux/response.reducer';
import { Spinner } from '@/components/ui/spinner';
import { TextBody } from './text.body';
import { BinaryBody } from './binary.body';
import { EmptyBody } from './empty.body';
import { SUPPORTED_TEXT_FORMATS } from '@/lib/constants';
import { selectRequestLoading } from '../request.section/redux/request.section.reducer';
import { abortOngoingRequestAsync } from '../request.section/redux/request.async.actions';
import { Button } from '@/components/ui/button';

export function ResponseBody() {
  const dispatch = useAppDispatch();
  const body = useAppSelector(selectResponseBody);
  const mimeType = useAppSelector(selectMimeType);
  const bodytype = useAppSelector(selectResponseBodytype);
  const loading = useAppSelector(selectRequestLoading);

  let bodyCompoent;

  const handleAbortingRequest = () => {
    dispatch(abortOngoingRequestAsync());
  };

  if (body) {
    if (SUPPORTED_TEXT_FORMATS.includes(bodytype)) {
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
      {loading ? (
        <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center gap-2">
          <Spinner />
          <Button variant={'outline'} onClick={handleAbortingRequest}>
            Cancel
          </Button>
        </div>
      ) : (
        bodyCompoent
      )}
    </div>
  );
}
