import { PROFILE_LINK, PROFILE_NAME } from '@/lib/constants';
export function Footer() {
  return (
    <footer className="flex p-2 items-center justify-center gap-2">
      <p className="text-sm">
        Made by
        <a
          className="px-2 underline"
          href={PROFILE_LINK}
          target="_blank"
          aria-description="github profile"
        >
          {PROFILE_NAME}
        </a>
      </p>
    </footer>
  );
}
