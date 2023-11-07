import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectActiveTab, setActiveTab } from '../tabs/redux/tabs.reducer';
import { deleteTabAsync } from './redux/tabs.async.actions';

interface RequestTabProps {
  id: string;
  name: string;
}

export function RequestTab({ id, name }: RequestTabProps) {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);

  return (
    <div
      className={`flex px-2 py-1 justify-between hover:cursor-pointer items-center border border-b-0 border-solid basis-40 grow-0 shrink-0 overflow-hidden bg-background text-sm ${
        activeTab == id
          ? 'border-b-0 border-r-0 border-l-0 border-t-2 border-primary bg-secondary'
          : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActiveTab(id));
      }}
    >
      <p className="whitespace-nowrap overflow-ellipsis overflow-hidden">
        {activeTab == id && (
          <span className="inline-block mr-2 rounded-full bg-primary h-2 w-2"></span>
        )}
        {name}
      </p>
      <div
        className="p-2 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(deleteTabAsync(id));
        }}
      >
        <X className="h-3 w-3" />
      </div>
    </div>
  );
}
