import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { ThemeWrapper } from '../theme/theme.wrapper';
import { selectAppLoading } from './redux/app.reducer';
import { AppLoader } from '@/components/ui/app.loader';
import { Header } from '../../layout/header';
import { Main } from '../../layout/main';
import { Sidebar } from '../../layout/sidebar';
import { ActivitySection } from '../../layout/activity.section';
import { RequestSection } from '../../layout/request.section';
import { ResponseSection } from '../../layout/response.section';
import { Footer } from '../../layout/footer';
import { useEffect } from 'react';
import { initAppDataAsync } from './redux/app.async.actions';

export function App() {
  const dispatch = useAppDispatch();
  const apploading = useAppSelector(selectAppLoading);

  useEffect(() => {
    dispatch(initAppDataAsync());
  }, []);

  return (
    <ThemeWrapper>
      <div className="flex flex-col h-screen overflow-hidden relative">
        {apploading ? (
          <AppLoader />
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
