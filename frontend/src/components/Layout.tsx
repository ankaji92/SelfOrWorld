import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  console.log('Layout rendered with theme:', theme);

  const navItems = [
    { path: '/worldtree', label: 'WorldTree', description: '大事なこと' },
    { path: '/compact', label: 'Compact', description: '未来を眺める' },
    { path: '/immersion', label: 'Immersion', description: '明日を生きる' },
    { path: '/reliving', label: 'ReLiving', description: '過去を学ぶ' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50/30 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-tertiary transition-colors">
      {/* Header */}
      <header className="bg-primary-50/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm border-b border-primary-200 dark:border-dark-border-primary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-700 to-accent-900 dark:from-dark-accent-primary dark:to-dark-accent-secondary bg-clip-text text-transparent">
              SelfOrWorld
            </h1>
            <p className="text-sm text-primary-600 dark:text-dark-text-secondary mt-1">「私」と「世界」を知る</p>
          </Link>
          <button
            onClick={() => {
              console.log('Button clicked!!!');
              toggleTheme();
            }}
            className="p-2 rounded-lg bg-primary-100 dark:bg-dark-bg-tertiary hover:bg-primary-200 dark:hover:bg-dark-border-secondary transition-colors"
            aria-label="テーマ切り替え"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-primary-800 dark:text-dark-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-dark-accent-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-primary-50/60 dark:bg-dark-bg-secondary/60 backdrop-blur-sm border-b border-primary-200 dark:border-dark-border-primary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-accent-700 dark:border-dark-accent-primary text-accent-700 dark:text-dark-accent-primary'
                      : 'border-transparent text-primary-600 dark:text-dark-text-secondary hover:text-accent-700 dark:hover:text-dark-accent-primary hover:border-primary-300 dark:hover:border-dark-border-secondary'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-xs text-primary-500 dark:text-dark-text-tertiary">{item.description}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
