import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestHistory } from '../domain/request.history/request.history';
import { RequestsSaved } from '../domain/request.saved/request.saved';
import { loadHistoryFromDbAsync } from '../domain/request.history/redux/history.async.actions';
import { useAppDispatch } from '../../common/hoooks';
import {
  loadCollectionsAsync,
  loadSavedRequestsAsync
} from '../domain/request.saved/redux/request.saved.async.actions';

export function ActivitySection() {
  const dispatch = useAppDispatch();
  const [tab, setCurrentTab] = useState<string>('history');

  useEffect(() => {
    dispatch(loadHistoryFromDbAsync());
    dispatch(loadCollectionsAsync());
    dispatch(loadSavedRequestsAsync());
  }, []);

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
