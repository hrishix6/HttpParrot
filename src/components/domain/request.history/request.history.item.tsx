import { Badge } from '@/components/ui/badge';
import { RequestHistoryItemActions } from './request.history.item.actions';
import { timeSince } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { RequestModel } from '@/common/types';
import { useAppDispatch } from '@/common/hoooks';
import { deleteHistoryItemAsync } from './redux/history.async.actions';
import { populateRequestSectionAsync } from '../tabs/redux/tabs.async.actions';

interface RequestHistoryItemProps {
  children?: React.ReactNode;
  request: RequestModel;
}

export function RequestHistoryItem({ request }: RequestHistoryItemProps) {
  const dispatch = useAppDispatch();

  const { method, name, url, triggered } = request;

  const [humanReadableTriggered, sethumanReadableTriggered] = useState<string>(
    timeSince(triggered)
  );

  const handleDelete = (id: string) => {
    dispatch(deleteHistoryItemAsync(id));
  };

  const handleViewInRequestSection = (r: RequestModel) => {
    dispatch(populateRequestSectionAsync({ model: r, mode: 'insert' }));
  };

  useEffect(() => {
    const interValId = setInterval(() => {
      sethumanReadableTriggered(timeSince(triggered));
    }, 15 * 1000);

    return () => {
      clearInterval(interValId);
    };
  }, []);

  return (
    <RequestHistoryItemActions
      handleDelete={handleDelete}
      handleViewInRequestSection={handleViewInRequestSection}
      request={request}
    >
      <div className="flex flex-col gap-2 p-2 border-b border-t cursor-context-menu card-background">
        <div className="flex gap-1">
          <Badge>{`${method[0].toUpperCase()}${method.slice(1)}`}</Badge>
          <p className="text-sm whitespace-nowrap overflow-ellipsis overflow-hidden">
            {name || url}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs">{humanReadableTriggered}</p>
        </div>
      </div>
    </RequestHistoryItemActions>
  );
}
