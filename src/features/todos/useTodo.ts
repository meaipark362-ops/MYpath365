import { useCallback } from 'react';
import { useUserStore, userStore } from '../../stores/userStore';

export function useTodo(pageId?: string) {
  const completedTodos = useUserStore((state) => state.completedTodos);

  const isCompleted = useCallback(
    (todoId: string, initialChecked = false): boolean => {
      if (Object.prototype.hasOwnProperty.call(completedTodos, todoId)) {
        return completedTodos[todoId];
      }
      return initialChecked;
    },
    [completedTodos]
  );

  const toggleTodo = useCallback((todoId: string) => {
    userStore.getState().toggleTodo(todoId);
  }, []);

  const setCompleted = useCallback((todoId: string, completed: boolean) => {
    userStore.getState().setTodoCompleted(todoId, completed);
  }, []);

  return {
    completedTodos,
    isCompleted,
    toggleTodo,
    setCompleted,
  };
}
