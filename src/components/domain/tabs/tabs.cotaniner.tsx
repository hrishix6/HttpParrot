import { useAppSelector } from '@/common/hoooks';
import { useRef } from 'react';
import { selectTabs } from '../tabs/redux/tabs.reducer';
import { RequestTab } from './request.tab';
import { RequestSection } from '../../layout/request.section';
import { ResponseSection } from '../../layout/response.section';
import { EmptyTabsPlaceholder } from './empty.tabs.placeholder';

export function TabsCotaniner() {
  const tabs = useAppSelector(selectTabs);
  const tabContainerRef = useRef<HTMLDivElement | null>(null);

  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    tabContainerRef.current?.scrollBy({
      left: e.deltaY < 0 ? -50 : 50
    });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {tabs.length ? (
        <>
          <div
            className="flex overflow-x-auto overflow-y-hidden  no-scrollbar border-b border-solid"
            ref={tabContainerRef}
            onWheel={handleWheelScroll}
          >
            {tabs.map((x) => (
              <RequestTab id={x.id} name={x.name} key={x.id} />
            ))}
          </div>
          <div className="flex flex-col flex-1 3xl:flex-row overflow-hidden">
            <RequestSection />
            <ResponseSection />
          </div>
        </>
      ) : (
        <EmptyTabsPlaceholder />
      )}
    </div>
  );
}
