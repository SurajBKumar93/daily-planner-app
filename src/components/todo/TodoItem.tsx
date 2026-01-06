import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { Check, Calendar, Trash2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, isCompleted: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const dueDate = todo.due_date ? parseISO(todo.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !todo.is_completed;
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "bg-card rounded-xl p-4 shadow-soft border border-border/50 touch-highlight",
        todo.is_completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id, todo.is_completed)}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200",
            todo.is_completed
              ? "bg-success border-success"
              : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {todo.is_completed && (
            <Check className="w-4 h-4 text-primary-foreground animate-scale-in" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium text-foreground leading-tight",
              todo.is_completed && "line-through text-muted-foreground"
            )}
          >
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <PriorityBadge priority={todo.priority} />
            
            {dueDate && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                  isOverdue
                    ? "bg-destructive/10 text-destructive"
                    : isDueToday
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Calendar className="w-3 h-3" />
                {isOverdue
                  ? "Overdue"
                  : isDueToday
                  ? "Today"
                  : format(dueDate, "MMM d")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(todo)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function PriorityBadge({ priority }: { priority: Todo['priority'] }) {
  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <span
      className={cn(
        "text-xs px-2 py-1 rounded-full font-medium",
        `priority-${priority}`
      )}
    >
      {labels[priority]}
    </span>
  );
}
