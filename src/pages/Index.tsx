import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isToday, isPast, isFuture, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTodos } from '@/hooks/useTodos';
import { Todo, FilterType, DateFilter, Priority, TodoFormData } from '@/types/todo';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { TodoList } from '@/components/todo/TodoList';
import { TodoFilters } from '@/components/todo/TodoFilters';
import { TodoForm } from '@/components/todo/TodoForm';
import { CalendarView } from '@/components/calendar/CalendarView';
import { Loader2 } from 'lucide-react';

type View = 'todos' | 'calendar';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { todos, loading, createTodo, updateTodo, toggleComplete, deleteTodo } = useTodos();
  
  const [currentView, setCurrentView] = useState<View>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Status filter
      if (statusFilter === 'completed' && !todo.is_completed) return false;
      if (statusFilter === 'incomplete' && todo.is_completed) return false;

      // Priority filter
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

      // Date filter
      if (dateFilter !== 'all' && todo.due_date) {
        const dueDate = parseISO(todo.due_date);
        switch (dateFilter) {
          case 'today':
            if (!isToday(dueDate)) return false;
            break;
          case 'upcoming':
            if (!isFuture(dueDate)) return false;
            break;
          case 'overdue':
            if (!isPast(dueDate) || isToday(dueDate)) return false;
            break;
        }
      } else if (dateFilter !== 'all' && !todo.due_date) {
        return false;
      }

      return true;
    });
  }, [todos, statusFilter, dateFilter, priorityFilter]);

  const handleAddClick = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: TodoFormData) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, data);
    } else {
      await createTodo(data);
    }
    setEditingTodo(null);
  };

  const todayCount = todos.filter(
    (t) => t.due_date && isToday(parseISO(t.due_date)) && !t.is_completed
  ).length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header
        title={currentView === 'todos' ? 'My Tasks' : 'Calendar'}
        subtitle={
          currentView === 'todos' && todayCount > 0
            ? `${todayCount} task${todayCount > 1 ? 's' : ''} for today`
            : undefined
        }
      />

      <main className="px-4 py-4">
        <AnimatePresence mode="wait">
          {currentView === 'todos' ? (
            <motion.div
              key="todos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TodoFilters
                statusFilter={statusFilter}
                dateFilter={dateFilter}
                priorityFilter={priorityFilter}
                onStatusChange={setStatusFilter}
                onDateChange={setDateFilter}
                onPriorityChange={setPriorityFilter}
              />
              <TodoList
                todos={filteredTodos}
                loading={loading}
                onToggle={toggleComplete}
                onEdit={handleEdit}
                onDelete={deleteTodo}
              />
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CalendarView
                todos={todos}
                loading={loading}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onToggle={toggleComplete}
                onEdit={handleEdit}
                onDelete={deleteTodo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddClick={handleAddClick}
      />

      <TodoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleFormSubmit}
        editingTodo={editingTodo}
        selectedDate={currentView === 'calendar' ? selectedDate : null}
      />
    </div>
  );
}
