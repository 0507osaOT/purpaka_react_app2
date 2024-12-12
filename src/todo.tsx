import React, { useState } from 'react';

// "Todo" 型の定義
type Todo = {
  content: string;
  readonly id: number;
};

// Todo コンポーネントの定義
const Todo: React.FC = () => {
  const [text, setText] = useState('');
  const [nextId, setNextId] = useState(1);
  const [todos, setTodos] = useState<Todo[]>([]);

  // handleEdit 関数
  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          // 新しいオブジェクトを作成して返す
          return { ...todo, content: value };
        }
        return todo;
      });
  
  
      // todos ステートが書き換えられていないかチェック
      console.log('=== Original todos ===');
      todos.map((todo) => {
        console.log(`id: ${todo.id}, content: ${todo.content}`);
      });
  
  
      return newTodos;
    });
  };

  // handleSubmit 関数を追加
  const handleSubmit = () => {
    if (!text.trim()) return;  // 空文字列の場合は何もしない

    const newTodo: Todo = {
      content: text,
      id: nextId,
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setNextId(nextId + 1);
    setText('');
  };

  return (
    <div>
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
        <input type="submit" value="追加" />  {/* content を value に修正 */}
      </form>
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="text"
                value={todo.content}
                onChange={(e) => handleEdit(todo.id, e.target.value)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Todo;