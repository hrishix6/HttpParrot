import { Badge } from '@/components/ui/badge';
import { RequestSavedItemActions } from './request.saved.item.actions';
import { timeSince } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { RequestModel } from '@/common/types';
import { useAppDispatch } from '@/common/hoooks';
import { deleteSavedRequestByIdAsync } from './redux/request.saved.async.actions';
import { populateRequestSectionAsync } from '../tabs/redux/tabs.async.actions';

interface RequestSavedItemProps {
  children?: React.ReactNode;
  request: RequestModel;
  collectionName: string;
}

export function RequestSavedItem({
  request,
  collectionName
}: RequestSavedItemProps) {
  const dispatch = useAppDispatch();

  const { method, name, url, triggered } = request;

  const [humanReadableTriggered, sethumanReadableTriggered] = useState<string>(
    timeSince(triggered)
  );

  const handleDelete = (id: string) => {
    dispatch(deleteSavedRequestByIdAsync(id));
  };

  const handleViewInRequestSection = (r: RequestModel) => {
    console.log(
      `populating tab with request model ${JSON.stringify(r, null, 2)}`
    );
    dispatch(
      populateRequestSectionAsync({ model: r, mode: 'update', collectionName })
    );
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
    <RequestSavedItemActions
      handleDelete={handleDelete}
      handleViewInRequestSection={handleViewInRequestSection}
      request={request}
    >
      <div className="flex flex-col gap-2 p-2 border-b border-t cursor-context-menu card-background transition-all duration-200">
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
    </RequestSavedItemActions>
  );
}
