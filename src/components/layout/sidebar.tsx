import React from 'react';

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="hidden flex-col lg:flex lg:w-80 border-r overflow-hidden">
      {children}
    </aside>
  );
}
