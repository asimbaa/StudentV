import { motion } from 'framer-motion';
import { FileText, CheckSquare, MessageSquare, Upload } from 'lucide-react';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';

const actions = [
  {
    icon: FileText,
    label: 'Eligibility Check',
    path: '/eligibility-check',
    external: true
  },
  {
    icon: Upload,
    label: 'Upload Documents',
    path: 'documents',
    external: false
  },
  {
    icon: CheckSquare,
    label: 'View Applications',
    path: 'applications',
    external: false
  },
  {
    icon: MessageSquare,
    label: 'Get Help',
    path: '/support',
    external: true
  }
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="h-full">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={action.path}
                  {...(action.external ? {} : { relative: "route" })}
                  className="p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors group block"
                >
                  <Icon className="w-6 h-6 text-[hsl(var(--gold))] mb-2" />
                  <span className="text-sm font-medium group-hover:text-[hsl(var(--gold))] transition-colors">
                    {action.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}