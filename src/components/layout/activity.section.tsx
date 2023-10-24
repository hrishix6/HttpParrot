import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestHistory } from '../domain/request.history/request.history';
import { RequestsSaved } from '../domain/request.saved/request.saved';
import { useAppDispatch, useAppSelector } from '../../redux/hoooks';
import { selectHistoryDb } from '../../redux/storage/storage.reducer';
import { loadHistoryFromDbAsync } from '../../redux/request.history/history.async.actions';

export function ActivitySection() {
  const dispatch = useAppDispatch();
  const historyDb = useAppSelector(selectHistoryDb);
  const [tab, setCurrentTab] = useState<string>('history');

  useEffect(() => {
    if (historyDb) {
      dispatch(loadHistoryFromDbAsync());
    }
  }, [historyDb]);

  return (
    <section className="flex flex-col flex-1 overflow-hidden">
      <Tabs
        value={tab}
        onValueChange={(e) => {
          setCurrentTab(e);
        }}
        className="flex-1 flex flex-col overflow-hidden px-2 pt-2"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {tab == 'history' && (
          <TabsContent
            className="flex-1 overflow-hidden flex flex-col"
            value="history"
          >
            <RequestHistory />
          </TabsContent>
        )}
        {tab === 'saved' && (
          <TabsContent
            className="flex-1 overflow-hidden flex flex-col"
            value="saved"
          >
            <RequestsSaved />
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
