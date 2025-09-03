import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Building, 
  Hammer, 
  Users, 
  FileText, 
  UserCheck, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@shared/models';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Building },
  { name: 'Projects', href: '/admin/projects', icon: Hammer },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Team', href: '/admin/team', icon: UserCheck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Force reload and redirect regardless of response
      window.location.replace('/login');
    } catch (error) {
      // Force reload and redirect even on error
      window.location.replace('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0 lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">G</span>
            </div>
            <span className="text-lg font-bold text-white">Gift Admin</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <Menu size={20} />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== '/admin' && location.startsWith(item.href));
              
              return (
                <Link key={item.name} href={item.href}>
                  <a 
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }
                    `}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t border-white/20 pt-4">
            <div className="flex items-center space-x-3 mb-3 px-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || 'User'
                  }
                </p>
                <p className="text-xs text-gray-300 capitalize">
                  {user?.role || 'user'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              data-testid="button-logout"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-background border-b border-border lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            data-testid="button-menu-toggle"
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Gift Admin</h1>
          <div></div>
        </div>

        {/* Page content */}
        <main className="p-6 min-h-screen bg-background">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
