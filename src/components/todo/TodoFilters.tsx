import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FilterType, DateFilter, Priority } from '@/types/todo';

interface TodoFiltersProps {
  statusFilter: FilterType;
  dateFilter: DateFilter;
  priorityFilter: Priority | 'all';
  onStatusChange: (filter: FilterType) => void;
  onDateChange: (filter: DateFilter) => void;
  onPriorityChange: (filter: Priority | 'all') => void;
}

export function TodoFilters({
  statusFilter,
  dateFilter,
  priorityFilter,
  onStatusChange,
  onDateChange,
  onPriorityChange,
}: TodoFiltersProps) {
  return (
    <div className="space-y-3 mb-6">
      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <FilterChip
          label="All"
          isActive={statusFilter === 'all'}
          onClick={() => onStatusChange('all')}
        />
        <FilterChip
          label="Active"
          isActive={statusFilter === 'incomplete'}
          onClick={() => onStatusChange('incomplete')}
        />
        <FilterChip
          label="Done"
          isActive={statusFilter === 'completed'}
          onClick={() => onStatusChange('completed')}
        />
      </div>

      {/* Date filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <FilterChip
          label="All dates"
          isActive={dateFilter === 'all'}
          onClick={() => onDateChange('all')}
          variant="secondary"
        />
        <FilterChip
          label="Today"
          isActive={dateFilter === 'today'}
          onClick={() => onDateChange('today')}
          variant="secondary"
        />
        <FilterChip
          label="Upcoming"
          isActive={dateFilter === 'upcoming'}
          onClick={() => onDateChange('upcoming')}
          variant="secondary"
        />
        <FilterChip
          label="Overdue"
          isActive={dateFilter === 'overdue'}
          onClick={() => onDateChange('overdue')}
          variant="secondary"
        />
      </div>

      {/* Priority filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <FilterChip
          label="All priorities"
          isActive={priorityFilter === 'all'}
          onClick={() => onPriorityChange('all')}
          variant="tertiary"
        />
        <FilterChip
          label="High"
          isActive={priorityFilter === 'high'}
          onClick={() => onPriorityChange('high')}
          variant="tertiary"
          className={priorityFilter === 'high' ? 'priority-high' : ''}
        />
        <FilterChip
          label="Medium"
          isActive={priorityFilter === 'medium'}
          onClick={() => onPriorityChange('medium')}
          variant="tertiary"
          className={priorityFilter === 'medium' ? 'priority-medium' : ''}
        />
        <FilterChip
          label="Low"
          isActive={priorityFilter === 'low'}
          onClick={() => onPriorityChange('low')}
          variant="tertiary"
          className={priorityFilter === 'low' ? 'priority-low' : ''}
        />
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

function FilterChip({ label, isActive, onClick, variant = 'primary', className }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors touch-highlight",
        isActive
          ? "text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId={`filter-bg-${variant}`}
          className="absolute inset-0 bg-primary rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
