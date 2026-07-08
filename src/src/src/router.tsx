import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface RouterContextProps {
  pathname: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextProps | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPathname(to);
  };

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export function Link({ to, children, ...props }: { to: string; children: ReactNode; [key: string]: any }) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export function Route({ path, element }: { path: string; element: ReactNode }) {
  const { pathname } = useRouter();
  return pathname === path ? element : null;
}

export function Routes({ children }: { children: ReactNode }) {
  return <>{children}</>;
}