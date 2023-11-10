import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  clearResponse,
  selectIfResponseOk,
  selectMimeType,
  selectResponseBody,
  selectResponseBodytype,
  selectResponseSize,
  selectResponseStatus,
  selectResponseTime
} from '../tabs/redux/tabs.reducer';
import { ResponseActionsDropDown } from './response.actions';

export function ResponseSectionHeader() {
  const size = useAppSelector(selectResponseSize);
  const status = useAppSelector(selectResponseStatus);
  const time = useAppSelector(selectResponseTime);
  const ok = useAppSelector(selectIfResponseOk);
  const body = useAppSelector(selectResponseBody);
  const mimeType = useAppSelector(selectMimeType);
  const bodytype = useAppSelector(selectResponseBodytype);

  const dispatch = useAppDispatch();

  const responseStatusClass = status
    ? ok
      ? `text-primary`
      : 'text-destructive'
    : '';

  return (
    <div className="flex items-stretch text-sm mt-2 px-1">
      <section className="flex-1 flex bg-muted px-1 py-1 gap-1">
        <div className="flex bg-background flex-1 border-solid border-secondary-foreground gap-2 px-2">
          <div className="flex">
            <p className="p-1 font-semibold flex items-center">
              Status {' : '}
            </p>
            <p
              className={`flex items-center font-semibold ${responseStatusClass}`}
            >
              {status}
            </p>
          </div>
        </div>
        <div className="flex bg-background flex-1 border-solid border-secondary-foreground gap-2 px-2">
          <div className="flex">
            <p className="p-1 font-semibold flex items-center">Size {' : '}</p>
            <p className="flex items-center font-semibold">{size}</p>
          </div>
        </div>
        <div className="flex bg-background flex-1 border-solid border-secondary-foreground gap-2 px-2">
          <div className="flex">
            <p className="p-1 font-semibold flex items-center">Time {' : '}</p>
            <p className="flex items-center font-semibold">{time}</p>
          </div>
        </div>
      </section>

      <div className="flex items-center">
        <Button onClick={() => dispatch(clearResponse(null))}>Clear</Button>
        <ResponseActionsDropDown
          bodyType={bodytype}
          body={body}
          mimeType={mimeType}
        />
      </div>
    </div>
  );
}
