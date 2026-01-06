import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  parseISO,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { TodoList } from '@/components/todo/TodoList';

interface CalendarViewProps {
  todos: Todo[];
  loading: boolean;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onToggle: (id: string, isCompleted: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function CalendarView({
  todos,
  loading,
  selectedDate,
  onDateSelect,
  onToggle,
  onEdit,
  onDelete,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTodosForDate = (date: Date) => {
    return todos.filter((todo) => {
      if (!todo.due_date) return false;
      return isSameDay(parseISO(todo.due_date), date);
    });
  };

  const selectedTodos = selectedDate
    ? getTodosForDate(selectedDate)
    : [];

  const hasTodos = (date: Date) => getTodosForDate(date).length > 0;
  const hasIncompleteTodos = (date: Date) =>
    getTodosForDate(date).some((todo) => !todo.is_completed);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const dayIsToday = isToday(day);
          const hasItems = hasTodos(day);
          const hasIncomplete = hasIncompleteTodos(day);

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day)}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all touch-highlight",
                !isCurrentMonth && "text-muted-foreground/40",
                isCurrentMonth && !isSelected && "hover:bg-secondary",
                isSelected && "bg-primary text-primary-foreground",
                dayIsToday && !isSelected && "ring-2 ring-primary ring-inset"
              )}
            >
              <span>{format(day, 'd')}</span>
              {hasItems && !isSelected && (
                <div
                  className={cn(
                    "absolute bottom-1.5 w-1.5 h-1.5 rounded-full",
                    hasIncomplete ? "bg-primary" : "bg-success"
                  )}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected date todos */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-4 border-t border-border"
          >
            <h3 className="text-lg font-display font-semibold mb-4">
              {isToday(selectedDate)
                ? "Today's Tasks"
                : format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {selectedTodos.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No tasks for this day
              </p>
            ) : (
              <TodoList
                todos={selectedTodos}
                loading={loading}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
