import React, { useState } from 'react';
import { RouterProvider, Routes, Route, Link, useRouter } from '@/src/src/src/router';
import HomeScreen from '@/screens/HomeScreen';
import RoleSwitcher from '@/components/RoleSwitcher';

const App: React.FC = () => {
  const { pathname } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    return (
      <React.Fragment key={segment}>
        <Link to={path} className={`text-kp-text hover:text-kp-primary ${isLast ? 'font-medium' : ''}`}>
          {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')}
        </Link>
        {!isLast && <span className="mx-2 text-kp-text/50">></span>}
      </React.Fragment>
    );
  });

  return (
    <RouterProvider>
      <div className="flex min-h-screen bg-kp-background text-kp-text">
        <aside
          className={`w-64 bg-kp-primary/5 border-r border-kp-secondary transition-all duration-200 ${
            !sidebarOpen ? '-translate-x-full' : ''
          }`}
        >
          <div className="flex items-center justify-between px-4 py-6">
            <h2 className="text-xl font-semibold text-kp-text">KP ETSIP</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 text-kp-text/50 hover:text-kp-text hover:bg-kp-secondary/10 rounded-md"
            >
              <span className="h-4 w-4">{sidebarOpen ? '◀' : '▶'}</span>
            </button>
          </div>
          <nav className="mt-6 space-y-2">
            <Link
              to="/"
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium text-kp-text/70 hover:bg-kp-secondary/10 hover:text-kp-text rounded-md ${
                pathname === '/' ? 'bg-kp-secondary/20 text-kp-text' : ''
              }`}
            >
              <span className="h-5 w-5">🏠</span>
              <span>Home</span>
            </Link>
            <Link
              to="/portfolios"
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium text-kp-text/70 hover:bg-kp-secondary/10 hover:text-kp-text rounded-md ${
                pathname.startsWith('/portfolios') ? 'bg-kp-secondary/20 text-kp-text' : ''
              }`}
            >
              <span className="h-5 w-5">📁</span>
              <span>Portfolios</span>
            </Link>
            <Link
              to="/applications"
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium text-kp-text/70 hover:bg-kp-secondary/10 hover:text-kp-text rounded-md ${
                pathname.startsWith('/applications') ? 'bg-kp-secondary/20 text-kp-text' : ''
              }`}
            >
              <span className="h-5 w-5">💻</span>
              <span>Applications</span>
            </Link>
            <Link
              to="/releases"
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium text-kp-text/70 hover:bg-kp-secondary/10 hover:text-kp-text rounded-md ${
                pathname.startsWith('/releases') ? 'bg-kp-secondary/20 text-kp-text' : ''
              }`}
            >
              <span className="h-5 w-5">🚀</span>
              <span>Releases</span>
            </Link>
            <Link
              to="/test"
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium text-kp-text/70 hover:bg-kp-secondary/10 hover:text-kp-text rounded-md ${
                pathname.startsWith('/test') ? 'bg-kp-secondary/20 text-kp-text' : ''
              }`}
            >
              <span className="h-5 w-5">🧪</span>
              <span>Test</span>
            </Link>
            <Link
              to="/release"
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium text-kp-text/70 hover:bg-kp-secondary/10 hover:text-kp-text rounded-md ${
                pathname.startsWith('/release') ? 'bg-kp-secondary/20 text-kp-text' : ''
              }`}
            >
              <span className="h-5 w-5">🔧</span>
              <span>Release</span>
            </Link>
            <Link
              to="/governance"
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium text-kp-text/70 hover:bg-kp-secondary/10 hover:text-kp-text rounded-md ${
                pathname.startsWith('/governance') ? 'bg-kp-secondary/20 text-kp-text' : ''
              }`}
            >
              <span className="h-5 w-5">⚖️</span>
              <span>Governance</span>
            </Link>
            <Link
              to="/administration"
              className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium text-kp-text/70 hover:bg-kp-secondary/10 hover:text-kp-text rounded-md ${
                pathname.startsWith('/administration') ? 'bg-kp-secondary/20 text-kp-text' : ''
              }`}
            >
              <span className="h-5 w-5">⚙️</span>
              <span>Administration</span>
            </Link>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="bg-kp-primary/5 px-4 py-6 shadow-sm border-b border-kp-secondary flex items-center justify-between">
            <h1 className="text-2xl font-bold text-kp-text">KP ETSIP SPA</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 text-kp-text/50 hover:text-kp-text hover:bg-kp-secondary/10 rounded-md md:hidden"
              >
                <span className="h-5 w-5">☰</span>
              </button>
              <RoleSwitcher />
            </div>
          </header>
          <div className="px-4 py-2 bg-kp-background/50 border-b border-kp-secondary">
            <div className="max-w-7xl mx-auto">
              <div className="text-sm text-kp-text/50">
                Home > {breadcrumbs}
              </div>
            </div>
          </div>
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/portfolios" element={<div className="text-kp-text/50 text-center py-12">Portfolios Page</div>} />
              <Route path="/applications" element={<div className="text-kp-text/50 text-center py-12">Applications Page</div>} />
              <Route path="/releases" element={<div className="text-kp-text/50 text-center py-12">Releases Page</div>} />
              <Route path="/test" element={<div className="text-kp-text/50 text-center py-12">Test Page</div>} />
              <Route path="/release" element={<div className="text-kp-text/50 text-center py-12">Release Page</div>} />
              <Route path="/governance" element={<div className="text-kp-text/50 text-center py-12">Governance Page</div>} />
              <Route path="/administration" element={<div className="text-kp-text/50 text-center py-12">Administration Page</div>} />
            </Routes>
          </main>
          <footer className="bg-kp-primary/5 px-4 py-6 mt-auto text-center text-kp-text/50 text-sm">
            KP ETSIP Static SPA Edition &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </RouterProvider>
  );
};

export default App;