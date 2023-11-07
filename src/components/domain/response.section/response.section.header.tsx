import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  clearResponse,
  selectIfResponseOk,
  selectResponseSize,
  selectResponseStatus,
  selectResponseTime
} from '../tabs/redux/tabs.reducer';

export function ResponseSectionHeader() {
  const size = useAppSelector(selectResponseSize);
  const status = useAppSelector(selectResponseStatus);
  const time = useAppSelector(selectResponseTime);
  const ok = useAppSelector(selectIfResponseOk);
  const dispatch = useAppDispatch();

  const responseStatusClass = status
    ? ok
      ? `text-primary`
      : 'text-destructive'
    : '';

  return (
    <div className="flex items-stretch justify-between gap-2 text-sm">
      <section className="flex-1 flex gap-2">
        <div className="flex bg-secondary flex-1 border-solid border gap-2 p-1">
          <p className="p-1 font-semibold bg-background flex items-center">
            Status
          </p>
          <p
            className={`flex items-center font-semibold ${responseStatusClass}`}
          >
            {status || '_ _'}
          </p>
        </div>
        <div className="flex bg-secondary flex-1 border-solid border gap-2 p-1">
          <p className="p-1 font-semibold bg-background flex items-center">
            Size
          </p>
          <p className="flex items-center font-semibold">
            {size || '_ _  bytes'}
          </p>
        </div>
        <div className="flex bg-secondary  flex-1 border-solid border gap-2 p-1">
          <p className="p-1 font-semibold bg-background flex items-center">
            Time
          </p>
          <p className="flex items-center font-semibold">{time || '_ _  ms'}</p>
        </div>
      </section>
      <Button onClick={() => dispatch(clearResponse(null))}>Clear</Button>
    </div>
  );
}
