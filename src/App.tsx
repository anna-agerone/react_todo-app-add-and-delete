/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { createTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './types/ErrorNotification';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<ErrorNotification | null>(
    null,
  );

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorNotification.loadingError);
        setTimeout(() => setErrorMessage(null), 3000);
      });
  }, []);

  const filterTodosByStatus = useCallback(() => {
    let filtered;

    switch (filter) {
      case FilterStatus.Active:
        filtered = todos.filter(todo => !todo.completed);
        break;
      case FilterStatus.Completed:
        filtered = todos.filter(todo => todo.completed);
        break;
      default:
        filtered = todos;
    }

    setFilteredTodos(filtered);
  }, [todos, filter]);

  useEffect(() => {
    filterTodosByStatus();
  }, [todos, filter, filterTodosByStatus]);

  const showErrorMessage = (message: ErrorNotification) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const handleAddTodo = (title: string) => {
    setErrorMessage(null);

    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      showErrorMessage(ErrorNotification.titleError);

      return Promise.reject('Title should not be empty');
    }

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    return createTodo(newTodo)
      .then(newTodoResponse => {
        setTodos(prevTodos => [...prevTodos, newTodoResponse]);
      })
      .catch(error => {
        showErrorMessage(ErrorNotification.addError);
        throw new Error(error);
      });
  };

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleAddTodo}
          allTodosCompleted={allTodosCompleted}
        />

        <TodoList todos={filteredTodos} />

        {todos.length > 0 && (
          <Footer filter={filter} setFilter={setFilter} todos={todos} />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
