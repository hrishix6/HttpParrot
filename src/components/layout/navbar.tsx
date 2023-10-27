import { ThemeToggle } from '../domain/theme/theme.toggle';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      <h3 className="text-primary font-semibold text-lg border-solid bg-background px-2 py-1 border-2">
        <a
          href="https://github.com/hrishix6/http-client"
          aria-description="github repository"
          target="_blank"
        >
          hrishix6/HttpClient
        </a>
      </h3>
      <ThemeToggle />
    </nav>
  );
}
