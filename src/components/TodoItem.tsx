import React from 'react';
import { Todo } from '../types';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

interface TodoItemProps {
  todo: Todo;
  index: number; // 追加
  updateTodo: (id: number, todo: Todo) => void;
  setTodos: (todos: Todo[]) => void;
  todos: Todo[];
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  updateTodo, 
  setTodos, 
  todos,
  provided,
  snapshot 
}) => {
  const handleTodoChange = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, [key]: value } : todo
    );

    setTodos(updatedTodos);

    const updatedTodo = updatedTodos.find(todo => todo.id === id);
    if (updatedTodo) {
      updateTodo(id, updatedTodo);
    }
  };

  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        ...provided.draggableProps.style,
        backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'white'
      }}
    >
      <input
        type="checkbox"
        disabled={todo.delete_flg}
        checked={todo.completed_flg}
        onChange={() => handleTodoChange(todo.id, 'completed_flg', !todo.completed_flg)}
      />
      <input
        type="text"
        disabled={todo.completed_flg || todo.delete_flg}
        value={todo.content}
        onChange={(e) => handleTodoChange(todo.id, 'content', e.target.value)}
      />
      <button onClick={() => handleTodoChange(todo.id, 'delete_flg', !todo.delete_flg)}>
        {todo.delete_flg ? '復元' : '削除'}
      </button>
    </li>
  );
};

export default TodoItem;