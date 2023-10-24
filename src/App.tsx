import { Footer } from './components/layout/footer';
import { Header } from './components/layout/header';
import { Main } from './components/layout/main';
import { RequestSection } from './components/layout/request.section';
import { ResponseSection } from './components/layout/response.section';
import { Sidebar } from './components/layout/sidebar';
import { ThemeWrapper } from './components/domain/theme/theme.wrapper';
import { ActivitySection } from './components/layout/activity.section';
import { useEffect } from 'react';
import {
  CollectionDatabase,
  HistoryDatabase,
  initDatabase
} from './redux/storage/db';
import { useAppDispatch } from './redux/hoooks';
import { setProviders } from './redux/storage/storage.reducer';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initDatabase()
      .then((db) => {
        const historydb = new HistoryDatabase(db);
        const collectiondb = new CollectionDatabase(db);
        dispatch(setProviders({ historydb, collectiondb }));
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <ThemeWrapper>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <Main>
          <Sidebar>
            <ActivitySection />
          </Sidebar>
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <RequestSection />
            <ResponseSection />
          </div>
        </Main>
        <Footer />
      </div>
    </ThemeWrapper>
  );
}

export default App;
