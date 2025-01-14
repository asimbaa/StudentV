import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const routeLabels: Record<string, string> = {
  'dashboard': 'Dashboard',
  'overview': 'Overview',
  'applications': 'Applications',
  'documents': 'Documents',
  'resources': 'Resources',
  'guides': 'Resource Guides',
  'videos': 'Resource Videos',
  'links': 'Resource Links',
  'faq': 'Resource FAQ',
  'scholarships': 'Scholarship Explorer',
  'financial-planner': 'Financial Planning',
  'eligibility-check': 'Eligibility Check',
  'visa-types': 'Visa Types',
  'contact': 'Contact',
  'about': 'About'
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on home page or auth pages
  if (location.pathname === '/' || 
      location.pathname === '/signin' || 
      location.pathname === '/register' ||
      location.pathname.startsWith('/auth/')) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-4 flex items-center text-sm"
    >
      <Link
        to="/"
        className="text-white/60 hover:text-[hsl(var(--gold))] transition-colors flex items-center"
      >
        <Home className="w-4 h-4" />
      </Link>

      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-white/40" />
            {isLast ? (
              <span className="text-[hsl(var(--gold))]">
                {routeLabels[segment] || segment}
              </span>
            ) : (
              <Link
                to={path}
                className="text-white/60 hover:text-[hsl(var(--gold))] transition-colors"
              >
                {routeLabels[segment] || segment}
              </Link>
            )}
          </div>
        );
      })}
    </motion.nav>
  );
}
