import { motion } from 'framer-motion';
import { CheckSquare, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'todos' | 'calendar';

interface BottomNavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddClick: () => void;
}

export function BottomNavigation({ currentView, onViewChange, onAddClick }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-bottom">
      <div className="flex items-center justify-around px-6 py-3">
        <NavItem
          icon={CheckSquare}
          label="Tasks"
          isActive={currentView === 'todos'}
          onClick={() => onViewChange('todos')}
        />
        
        <button
          onClick={onAddClick}
          className="relative -mt-8 touch-highlight"
        >
          <div className="w-14 h-14 rounded-full bg-primary shadow-elevated flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </div>
        </button>
        
        <NavItem
          icon={Calendar}
          label="Calendar"
          isActive={currentView === 'calendar'}
          onClick={() => onViewChange('calendar')}
        />
      </div>
    </nav>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-2 touch-highlight relative",
        isActive ? "text-nav-active" : "text-nav-foreground"
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}
