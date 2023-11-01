import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { ThemeWrapper } from '../theme/theme.wrapper';
import { selectAppError, selectAppLoading } from './redux/app.reducer';
import { AppLoader } from '@/components/domain/app/app.loader';
import { Header } from '../../layout/header';
import { Main } from '../../layout/main';
import { Sidebar } from '../../layout/sidebar';
import { ActivitySection } from '../../layout/activity.section';
import { RequestSection } from '../../layout/request.section';
import { ResponseSection } from '../../layout/response.section';
import { Footer } from '../../layout/footer';
import { useEffect } from 'react';
import { initAppDataAsync } from './redux/app.async.actions';
import { AppError } from './app.error';

export function App() {
  const dispatch = useAppDispatch();
  const apploading = useAppSelector(selectAppLoading);
  const appError = useAppSelector(selectAppError);

  useEffect(() => {
    dispatch(initAppDataAsync());
  }, []);

  if (apploading) {
    return <AppLoader />;
  }

  if (appError) {
    return <AppError />;
  }

  return (
    <ThemeWrapper>
      <div className="flex flex-col h-screen overflow-hidden relative">
        <Header />
        <Main>
          <Sidebar>
            <ActivitySection />
          </Sidebar>
          <div className="flex flex-col xl:flex-row flex-1 overflow-hidden">
            <RequestSection />
            <ResponseSection />
          </div>
        </Main>
        <Footer />
      </div>
    </ThemeWrapper>
  );
}
