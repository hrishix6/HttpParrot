import { Footer } from '../components/layout/footer';
import { Header } from '../components/layout/header';
import { Main } from '../components/layout/main';
import { RequestSection } from '../components/layout/request.section';
import { ResponseSection } from '../components/layout/response.section';
import { Sidebar } from '../components/layout/sidebar';
import { ThemeWrapper } from '../components/domain/theme/theme.wrapper';
import { ActivitySection } from '../components/layout/activity.section';
import { useEffect, useState } from 'react';
import { historyDb, collectionDB, initDatabase } from '@/lib/db';
import { Spinner } from '../components/ui/spinner';

function App() {
  const [apploading, setappLoading] = useState(true);

  useEffect(() => {
    initDatabase()
      .then((db) => {
        historyDb.setDb(db);
        collectionDB.setDb(db);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setappLoading(false);
      });
  }, []);

  return (
    <ThemeWrapper>
      <div className="flex flex-col h-screen overflow-hidden relative">
        {apploading ? (
          <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </ThemeWrapper>
  );
}

export default App;
