import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  selectRequestLoading,
  selectResponseBody,
  selectResponseBodytype,
  selectActiveTab
} from '../tabs/redux/tabs.reducer';
import { Spinner } from '@/components/ui/spinner';
import { TextBody } from './text.body';
import { BinaryBody } from './binary.body';
import { EmptyBody } from './empty.body';
import { SUPPORTED_TEXT_FORMATS } from '@/lib/constants';
import { abortOngoingRequestAsync } from '../tabs/redux/tabs.async.actions';
import { Button } from '@/components/ui/button';

export function ResponseBody() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const body = useAppSelector(selectResponseBody);
  const bodytype = useAppSelector(selectResponseBodytype);
  const loading = useAppSelector(selectRequestLoading);

  let bodyCompoent;

  const handleAbortingRequest = () => {
    dispatch(abortOngoingRequestAsync(activeTab));
  };

  if (body) {
    if (SUPPORTED_TEXT_FORMATS.includes(bodytype)) {
      bodyCompoent = <TextBody bodyType={bodytype} text={body} />;
    } else {
      bodyCompoent = <BinaryBody />;
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
