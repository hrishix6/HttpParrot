import { Badge } from '@/components/ui/badge';
import { RequestSavedItemActions } from './request.saved.item.actions';
import { timeSince } from '../../../lib/utils';
import { useState, useEffect } from 'react';
import { RequestModel } from '../../../types';
import { useAppDispatch } from '../../../redux/hoooks';
import { deleteSavedRequestByIdAsync } from '../../../redux/request.saved/request.saved.async.actions';
import { populateRequestSection } from '../../../redux/request.section/request.section.reducer';

interface RequestSavedItemProps {
  children?: React.ReactNode;
  request: RequestModel;
}

export function RequestSavedItem({ request }: RequestSavedItemProps) {
  const dispatch = useAppDispatch();

  const { method, name, url, triggered } = request;

  const [humanReadableTriggered, sethumanReadableTriggered] = useState<string>(
    timeSince(triggered)
  );

  const handleDelete = (id: string) => {
    dispatch(deleteSavedRequestByIdAsync(id));
  };

  const handleViewInRequestSection = (r: RequestModel) => {
    dispatch(populateRequestSection({ model: r, mode: 'update' }));
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
    </RequestSavedItemActions>
  );
}
