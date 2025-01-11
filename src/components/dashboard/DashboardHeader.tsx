import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, User, Settings, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../auth/AuthProvider';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

export function DashboardHeader() {
  const { user } = useAuthContext();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notifications - replace with real data
  const notifications: Notification[] = [
    {
      id: '1',
      message: 'Your document has been verified',
      type: 'success',
      read: false
    },
    {
      id: '2',
      message: 'Application deadline approaching',
      type: 'warning',
      read: false
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-8 bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="text-white/60 text-sm">Manage your visa application progress</p>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/dashboard/help">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </Button>
        </Link>

        <Link to="/dashboard/settings">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          className="relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {unreadCount}
            </span>
          )}
        </Button>

        <Link to="/dashboard/profile">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden md:inline">Profile</span>
          </Button>
        </Link>

        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-0 w-80 bg-black/90 border border-white/10 rounded-lg shadow-xl z-50"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${
                    !notification.read ? 'bg-white/5' : ''
                  }`}
                >
                  <p className="text-sm text-white/80">{notification.message}</p>
                </div>
              ))}
            </div>
            <div className="p-3 text-center border-t border-white/10">
              <button className="text-sm text-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]/80">
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}