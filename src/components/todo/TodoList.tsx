import { AnimatePresence } from 'framer-motion';
import { ListChecks } from 'lucide-react';
import { Todo } from '@/types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: string, isCompleted: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, loading, onToggle, onEdit, onDelete }: TodoListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl p-4 shadow-soft animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ListChecks className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No tasks yet</h3>
        <p className="text-sm text-muted-foreground text-center">
          Tap the + button to add your first task
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
