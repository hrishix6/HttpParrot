import { ThemeToggle } from '../domain/theme/theme.toggle';
import { Bird } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center bg-background gap-2 px-2 py-1 border-2">
        <Bird className="h-5 w-5 text-primary" />
        <h3 className="text-primary font-semibold text-lg border-solid">
          <a
            href="https://github.com/hrishix6/HttpParrot"
            aria-description="github repository"
            target="_blank"
          >
            HttpParrot
          </a>
        </h3>
      </div>
      <ThemeToggle />
    </nav>
  );
}
