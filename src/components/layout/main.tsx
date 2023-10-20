import React from 'react';

interface MainProps {
  children?: React.ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <main className="flex flex-1 border-solid border-b border-t overflow-hidden">
      {children}
    </main>
  );
}
