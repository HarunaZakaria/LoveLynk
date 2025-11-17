import { Outlet, Link, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

const Layout = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { path: '/discovery', label: 'Discover', icon: '🔍' },
    { path: '/matches', label: 'Matches', icon: '💜' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-cosmic-dark">
      {/* Top Navigation */}
      <nav className="bg-cosmic-slate border-b border-cosmic-purple/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/discovery" className="text-2xl font-heading font-bold bg-cosmic-gradient bg-clip-text text-transparent">
            SoulSync
          </Link>
          <div className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-cosmic-purple text-white'
                    : 'text-gray-300 hover:bg-cosmic-slate'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Logout
            </button>
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

