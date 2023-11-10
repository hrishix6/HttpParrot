import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import { selectAppError, selectAppLoading } from './redux/app.reducer';
import { AppLoader } from '@/components/domain/app/app.loader';
import { Header } from '../../layout/header';
import { Main } from '../../layout/main';
import { Sidebar } from '../../layout/sidebar';
import { ActivitySection } from '../../layout/activity.section';
import { Footer } from '../../layout/footer';
import { useEffect } from 'react';
import { initAppDataAsync } from './redux/app.async.actions';
import { AppError } from './app.error';
import { Button } from '../../ui/button';
import { Plus } from 'lucide-react';
import { TabsCotaniner } from '../tabs/tabs.cotaniner';
import { newTabAsync } from '../tabs/redux/tabs.async.actions';
import { MobileSidebar } from '../../layout/mobile.sidebar';

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
    <div className="flex flex-col h-screen overflow-hidden relative">
      <Header />
      <Main>
        <Sidebar>
          <div className="mx-1">
            <Button
              className="w-full"
              onClick={(_) => {
                dispatch(newTabAsync());
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>New Request</span>
            </Button>
          </div>
          <ActivitySection />
        </Sidebar>
        <div className="hidden flex-col lg:flex lg:w-80 border-r"></div>
        <TabsCotaniner />
      </Main>
      <Footer />
      <MobileSidebar />
    </div>
  );
}
