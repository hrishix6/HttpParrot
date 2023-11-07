import { ThemeToggle } from '../domain/theme/theme.toggle';
import { Bird } from 'lucide-react';
import { APP_GITHUB_LINK, APP_NAME } from '@/lib/constants';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center bg-background gap-2 px-2 py-1 border-2">
        <Bird className="h-5 w-5 text-primary" />
        <h3 className="text-primary font-semibold text-xl border-solid">
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
