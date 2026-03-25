import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 목록 불러오기
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/todos`);
      setTodos(res.data);
    } catch {
      setError('목록을 불러오지 못했어요 😢');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Todo 추가
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/api/todos`, { title: input });
      setTodos([res.data, ...todos]);
      setInput('');
    } catch {
      setError('추가에 실패했어요 😢');
    }
  };

  // 완료 토글
  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(`${API_URL}/api/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    } catch {
      setError('업데이트에 실패했어요 😢');
    }
  };

  // 삭제
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch {
      setError('삭제에 실패했어요 😢');
    }
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">📝 Todo List</h1>
          <p className="text-sm text-gray-400 mt-1">
            총 {todos.length}개 · 완료 {completedCount}개
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm flex justify-between">
            {error}
            <button onClick={() => setError('')} className="font-bold">✕</button>
          </div>
        )}

        {/* 입력 폼 */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="할 일을 입력하세요..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            추가
          </button>
        </form>

        {/* Todo 목록 */}
        {loading ? (
          <div className="text-center text-gray-400 py-8">불러오는 중...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-300 py-8">
            <div className="text-4xl mb-2">🎉</div>
            할 일이 없어요!
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map(todo => (
              <li
                key={todo._id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 group transition-colors"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer flex-shrink-0"
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.completed ? 'line-through text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs font-medium transition-opacity"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 완료된 항목 일괄 삭제 */}
        {completedCount > 0 && (
          <button
            onClick={async () => {
              const completed = todos.filter(t => t.completed);
              await Promise.all(completed.map(t => axios.delete(`${API_URL}/api/todos/${t._id}`)));
              setTodos(todos.filter(t => !t.completed));
            }}
            className="mt-4 w-full text-xs text-gray-400 hover:text-red-400 transition-colors py-1"
          >
            완료된 항목 모두 삭제 ({completedCount}개)
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
