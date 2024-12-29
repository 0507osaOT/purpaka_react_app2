// src/api.ts
// Todo型をインポートしています
import { Todo } from './todo';

// Todo一覧を取得する非同期関数。戻り値はTodoの配列です
export const fetchTodos = async (): Promise<Todo[]> => {
  // localhost:3031のエンドポイントにGETリクエストを送信
  const response = await fetch("http://localhost:3031/api/v1/todos");
  // レスポンスをJSON形式で返却
  return response.json();
};

// 新しいTodoを作成する非同期関数。引数はid以外のTodoの属性、戻り値は作成されたTodo
export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  // POSTリクエストを送信
  const response = await fetch("http://localhost:3031/api/v1/todos", {
    method: "POST",
    // JSONデータを送信することを指定
    headers: {
      "Content-Type": "application/json",
    },
    // todoオブジェクトをJSON文字列に変換して送信
    body: JSON.stringify(todo),
  });
  return response.json();
};

// Todoを更新する非同期関数。id と 更新するTodoの部分的なデータを受け取り、更新後のTodoを返す
export const updateTodo = async (id: number, updatedTodo: Partial<Todo>): Promise<Todo> => {
  // PATCHリクエストを送信
  const response = await fetch(`http://localhost:3031/api/v1/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    // 更新データをJSON文字列として送信
    body: JSON.stringify(updatedTodo),
  });
  return response.json();
};

// Todoを削除する非同期関数。idを受け取り、戻り値はなし（void）
export const deleteTodo = async (id: number): Promise<void> => {
  // DELETEリクエストを送信
  await fetch(`http://localhost:3031/api/v1/todos/${id}`, {
    method: "DELETE",
  });
};