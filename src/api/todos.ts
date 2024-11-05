import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1816;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export function createTodo({
  title,
  userId,
  completed,
}: {
  title: string;
  userId: number;
  completed: boolean;
}): Promise<Todo> {
  return client.post<Todo>('/todos', { title, userId, completed });
}
