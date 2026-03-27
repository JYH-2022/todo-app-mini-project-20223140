import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const COLORS = [
  'from-pink-400 to-rose-400',
  'from-violet-400 to-purple-400',
  'from-blue-400 to-cyan-400',
  'from-emerald-400 to-teal-400',
  'from-orange-400 to-amber-400',
];

function TodoItem({ todo, onToggle, onDelete, colorClass }) {
  const [removing, setRemoving] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleDelete = async () => {
    setRemoving(true);
    setTimeout(() => onDelete(todo._id), 300);
  };

  const handleToggle = async () => {
    setChecking(true);
    await onToggle(todo._id, todo.completed);
    setTimeout(() => setChecking(false), 400);
  };

  return (
    <li
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(60px) scale(0.8)' : 'translateX(0) scale(1)',
      }}
      className="group flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
    >
      {/* 색상 도트 */}
      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${colorClass} flex-shrink-0`} />

      {/* 체크박스 커스텀 */}
      <button
        onClick={handleToggle}
        style={{ transition: 'transform 0.2s', transform: checking ? 'scale(1.3)' : 'scale(1)' }}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          todo.completed
            ? 'bg-gradient-to-br from-emerald-400 to-teal-400 border-transparent'
            : 'border-gray-300 hover:border-violet-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* 제목 */}
      <span
        className={`flex-1 text-base font-medium transition-all duration-300 ${
          todo.completed ? 'line-through text-gray-300' : 'text-gray-700'
        }`}
      >
        {todo.title}
      </span>

      {/* 삭제 버튼 */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 flex items-center justify-center transition-all duration-200 flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const inputRef = useRef(null);

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

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setAdding(true);
    try {
      const res = await axios.post(`${API_URL}/api/todos`, { title: input });
      setTodos([res.data, ...todos]);
      setInput('');
      inputRef.current?.focus();
    } catch {
      setError('추가에 실패했어요 😢');
    } finally {
      setTimeout(() => setAdding(false), 300);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(`${API_URL}/api/todos/${id}`, { completed: !completed });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch {
      setError('업데이트에 실패했어요 😢');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      setTimeout(() => setTodos(prev => prev.filter(t => t._id !== id)), 300);
    } catch {
      setError('삭제에 실패했어요 😢');
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100 flex items-center justify-center p-6">

      {/* 배경 장식 */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-48 h-48 bg-violet-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-cyan-200 rounded-full opacity-20 blur-2xl pointer-events-none" />

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-8 border border-white/60 relative">

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-xl shadow-md">
              ✨
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              Todo List
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-1 mt-1">
            총 {todos.length}개 · 완료 {completedCount}개
          </p>

          {/* 진행 바 */}
          {todos.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>진행률</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 에러 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-2xl text-sm flex justify-between items-center border border-red-100">
            {error}
            <button onClick={() => setError('')} className="ml-2 font-bold hover:text-red-700">✕</button>
          </div>
        )}

        {/* 입력 폼 */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="✏️  새로운 할 일을 입력해요..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:bg-white transition-all duration-200 placeholder-gray-300"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            style={{ transition: 'all 0.2s', transform: adding ? 'scale(0.92)' : 'scale(1)' }}
            className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:from-gray-200 disabled:to-gray-200 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg disabled:shadow-none transition-all duration-200"
          >
            추가
          </button>
        </form>

        {/* Todo 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-3 border-violet-300 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm mt-3">불러오는 중...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-14">
            <div className="text-5xl mb-3">🌈</div>
            <p className="text-gray-400 text-sm font-medium">할 일을 추가해봐요!</p>
          </div>
        ) : (
          <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {todos.map((todo, i) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                colorClass={COLORS[i % COLORS.length]}
              />
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
            className="mt-5 w-full py-2.5 text-xs font-semibold text-gray-400 hover:text-red-400 bg-gray-50 hover:bg-red-50 rounded-2xl transition-all duration-200 border border-dashed border-gray-200 hover:border-red-200"
          >
            🗑️ 완료된 항목 모두 삭제 ({completedCount}개)
          </button>
        )}
      </div>
    </div>
  );
}

export default App;