import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';
import {
  selectShowMobilesidebar,
  toggleMobileSidebar
} from '../domain/app/redux/app.reducer';
import {
  useAppDispatch,
  useAppSelector,
  useWindowWidth
} from '@/common/hoooks';
import { Button } from '@/components/ui/button';
import { newTabAsync } from '../domain/tabs/redux/tabs.async.actions';
import { ActivitySection } from './activity.section';
import { APP_GITHUB_LINK, APP_NAME } from '../../lib/constants';
import { useEffect } from 'react';

export function MobileSidebar() {
  const dispatch = useAppDispatch();
  const show = useAppSelector(selectShowMobilesidebar);
  const ww = useWindowWidth();

  useEffect(() => {
    if (show && ww > 1200) {
      dispatch(toggleMobileSidebar(false));
    }
  }, [ww]);

  const handleOpenChange = (open: boolean) => {
    dispatch(toggleMobileSidebar(open));
  };

  return (
    <Dialog.Root open={show} onOpenChange={handleOpenChange}>
      <Dialog.Trigger></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="absolute overflow-hidden inset-0 z-50 bg-background/80 backdrop-blur-sm  
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          className="absolute top-0 left-0 w-80 h-full overflow-hidden z-50 border bg-background shadow-lg duration-200 
          data-[state=closed]:slide-out-to-left-1/2 
          data-[state=open]:slide-in-from-left-1/2
          "
        >
          <div className="flex items-center gap-2 p-2 mt-2">
            <img src="logo.svg" className="h-5 w-5" />
            <h3 className="text-primary font-semibold text-lg border-solid">
              <a
                href={APP_GITHUB_LINK}
                aria-description="github repository"
                target="_blank"
              >
                {APP_NAME}
              </a>
            </h3>
          </div>
          <section className="mt-1 flex flex-col h-full overflow-hidden">
            <div>
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
          </section>
          <Dialog.Close className="absolute right-4 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
