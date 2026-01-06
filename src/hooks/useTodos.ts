import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Todo, TodoFormData, Priority } from '@/types/todo';
import { toast } from 'sonner';

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the database response to our Todo type
      const mappedTodos: Todo[] = (data || []).map(item => ({
        ...item,
        priority: item.priority as Priority
      }));
      
      setTodos(mappedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = async (data: TodoFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('todos').insert({
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        priority: data.priority,
        due_date: data.due_date || null,
      });

      if (error) throw error;
      
      toast.success('Task created');
      await fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Failed to create task');
    }
  };

  const updateTodo = async (id: string, data: Partial<TodoFormData & { is_completed: boolean }>) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      await fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update task');
    }
  };

  const toggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_completed: !isCompleted })
        .eq('id', id);

      if (error) throw error;
      
      await fetchTodos();
      toast.success(isCompleted ? 'Task uncompleted' : 'Task completed');
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Task deleted');
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete task');
    }
  };

  return {
    todos,
    loading,
    createTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
    refetch: fetchTodos,
  };
}
