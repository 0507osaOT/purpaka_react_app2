import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import TodoItem from './components/TodoItem';
import type { Todo } from './types';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type Filter = 'all' | 'completed' | 'unchecked' | 'delete';

// TodoItemPropsの型定義を追加
type TodoItemProps = {
  todo: Todo;
  updateTodo: (id: number, todo: Todo) => Promise<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  index: number;
  provided: any;
  snapshot: any;
};

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [nextId, setNextId] = useState(1);
  const [filter, setFilter] = useState<Filter>('all');

  const isFormDisabled = filter === 'completed' || filter === 'delete';

  useEffect(() => {
    fetchTodos().then(data => setTodos(data));
  }, []);

  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
  };

  const handleSubmit = () => {
    if (!text) return;

    const newTodo: Omit<Todo, 'id'> = {
      content: text,
      completed_flg: false,
      delete_flg: false,
      sort: 0,
    };

    createTodo(newTodo).then(data => {
      setTodos((prevTodos) => [data, ...prevTodos]);
      setNextId(nextId + 1);
      setText('');
    });
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed':
        return todos.filter((todo) => todo.completed_flg && !todo.delete_flg);
      case 'unchecked':
        return todos.filter((todo) => !todo.completed_flg && !todo.delete_flg);
      case 'delete':
        return todos.filter((todo) => todo.delete_flg);
      default:
        return todos.filter((todo) => !todo.delete_flg);
    }
  };

  const handleEmpty = () => {
    const filteredTodos = todos.filter(todo => !todo.delete_flg);
    const deletePromises = todos
      .filter(todo => todo.delete_flg)
      .map(todo => deleteTodo(todo.id));
    
    Promise.all(deletePromises).then(() => setTodos(filteredTodos));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      console.log("ドラッグがキャンセルされました");
      return;
    }
    
    const newTodos = Array.from(todos);
    const [movedTodo] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, movedTodo);
    
    setTodos(newTodos);
    console.log("並べ替え後のTodos:", newTodos);
    
    newTodos.forEach((todo, index) => {
      const updatedTodo = { ...todo, sort: index + 1 };
      updateTodo(todo.id, updatedTodo).catch((error) => {
        console.error(`Todo ${todo.id} の更新に失敗しました:`, error);
      });
    });
  };

  return (
    <div className="todo-container">
      <select
        defaultValue="all"
        onChange={(e) => handleFilterChange(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="completed">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="delete">ごみ箱</option>
      </select>

      {filter === 'delete' && (
        <button onClick={handleEmpty}>ごみ箱を空にする</button>
      )}
      
      {filter !== 'completed' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">追加</button>
        </form>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {getFilteredTodos().map((todo,mappingIndex) => (
                <Draggable
                  key={todo.id}
                  draggableId={String(todo.id)}
                  index={mappingIndex}
                >
                  {(provided, snapshot) => (
                    <TodoItem
                      todo={todo}
                      
                      updateTodo={updateTodo}
                      setTodos={setTodos}
                      todos={todos}
                      provided={provided}
                      snapshot={snapshot}
                      index={mappingIndex}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Todo;