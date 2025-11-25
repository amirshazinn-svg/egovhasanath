import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  hideNav?: boolean;
}

export function AppLayout({ children, title, hideNav = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header title={title} />
      <main className="pb-24 max-w-lg mx-auto">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
