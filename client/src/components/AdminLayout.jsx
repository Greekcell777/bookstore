import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  Tag, 
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Bell,
  Home,
  Shield,
  UserCircle
} from 'lucide-react';
import { useBookStore } from './BookstoreContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use BookStore context
  const { user, logout, isLoading } = useBookStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update active menu based on current path
  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveMenu(path);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { id: 'books', label: 'Books', icon: <BookOpen size={20} />, path: '/admin/books' },
    { id: 'orders', label: 'Orders', icon: <Package size={20} />, path: '/admin/orders' },
    { id: 'users', label: 'Users', icon: <Users size={20} />, path: '/admin/customers' },
    { id: 'categories', label: 'Categories', icon: <Tag size={20} />, path: '/admin/categories' },
    { id: 'reviews', label: 'Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
    // { id: 'products', label: 'Products', icon: <ShoppingBag size={20} />, path: '/admin/products' },
    // { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertCircle size={64} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the admin panel.</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login', { state: { adminRedirect: '/admin' } })}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <Shield size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin panel. 
            Your role is <span className="font-semibold">{user.role}</span>.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Return to Home
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 right-0 left-0 lg:left-64 z-40">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 lg:hidden text-gray-600 hover:text-gray-900"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <div className="flex items-center space-x-2">
                <Shield size={12} className="text-blue-600" />
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="hidden md:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Visit Store"
            >
              <Home size={18} />
              <span>Visit Store</span>
            </Link>
            
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900"
              title="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.first_name || user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle size={24} />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Shield size={10} className="text-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen bg-linear-to-b from-gray-900 to-gray-800 text-white transition-all duration-300
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Shield size={20} />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-lg">BookNook Admin</span>
                  <div className="text-xs text-gray-400">v1.0.0</div>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2 mb-4">
              {sidebarOpen && (
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                  Main Menu
                </div>
              )}
            </div>
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      setActiveMenu(item.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`
                      group flex items-center px-3 py-3 rounded-lg transition-all duration-200
                      ${activeMenu === item.id 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <span className={`flex-shrink-0 ${activeMenu === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                    {!sidebarOpen && (
                      <div className="lg:opacity-0 lg:group-hover:opacity-100 lg:invisible lg:group-hover:visible absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap transition-all duration-200">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Quick Stats (only show when sidebar is open) */}
            {sidebarOpen && (
              <div className="mt-8 px-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Quick Stats
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Online Users</span>
                    <span className="font-bold text-green-400">24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Pending Orders</span>
                    <span className="font-bold text-yellow-400">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Low Stock</span>
                    <span className="font-bold text-red-400">5</span>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-gray-800 space-y-3">
            {sidebarOpen && (
              <div className="text-center text-xs text-gray-500">
                <p>BookNook Admin Panel</p>
                <p>© {new Date().getFullYear()} All rights reserved</p>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-200
                text-gray-300 hover:bg-red-900 hover:text-white hover:shadow-md
                ${sidebarOpen ? 'justify-start' : 'justify-center'}
              `}
              title="Logout"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="ml-3">Logout</span>}
              {!sidebarOpen && (
                <div className="lg:opacity-0 lg:group-hover:opacity-100 lg:invisible lg:group-hover:visible absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap transition-all duration-200">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        pt-16 transition-all duration-300 min-h-screen
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}
      `}>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating Back to Store Button (Mobile) */}
      {!sidebarOpen && (
        <Link
          to="/"
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition z-50"
          title="Back to Store"
        >
          <Home size={24} />
        </Link>
      )}
    </div>
  );
};

export default AdminLayout;