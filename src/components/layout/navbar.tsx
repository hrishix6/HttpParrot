import { ThemeToggle } from '../domain/theme/theme.toggle';
import { APP_GITHUB_LINK, APP_NAME } from '@/lib/constants';
import { MenuIcon } from 'lucide-react';
import { useAppDispatch } from '@/common/hoooks';
import { toggleMobileSidebar } from '../domain/app/redux/app.reducer';
import { Button } from '../ui/button';

export function Navbar() {
  const dispatch = useAppDispatch();

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center bg-background gap-1 py-1 lg:ml-2">
        <Button
          className="lg:hidden"
          variant={'ghost'}
          size={'icon'}
          onClick={() => {
            dispatch(toggleMobileSidebar(true));
          }}
        >
          <MenuIcon className="lg:hidden h-5 w-5" />
        </Button>
        <img src="logo.svg" className="h-5 w-5" />
        <h3 className="ml-1 text-primary font-semibold text-lg border-solid">
          <a
            href={APP_GITHUB_LINK}
            aria-description="github repository"
            target="_blank"
          >
            {APP_NAME}
          </a>
        </h3>
      </div>
      <ThemeToggle />
    </nav>
  );
}
