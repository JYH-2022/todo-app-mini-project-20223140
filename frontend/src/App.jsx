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

function TodoItem({ todo, onToggle, onDelete, colorClass, dark, searchQuery }) {
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

  // 검색어 하이라이팅
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-yellow-200 text-yellow-800 rounded px-0.5">{part}</mark>
        : part
    );
  };

  return (
    <li
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(60px) scale(0.8)' : 'translateX(0) scale(1)',
      }}
      className={`group flex items-center gap-3 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border ${
        dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}
    >
      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${colorClass} flex-shrink-0`} />

      <button
        onClick={handleToggle}
        style={{ transition: 'transform 0.2s', transform: checking ? 'scale(1.3)' : 'scale(1)' }}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          todo.completed
            ? 'bg-gradient-to-br from-emerald-400 to-teal-400 border-transparent'
            : dark ? 'border-gray-500 hover:border-violet-400' : 'border-gray-300 hover:border-violet-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span className={`flex-1 text-base font-medium transition-all duration-300 ${
        todo.completed ? 'line-through text-gray-400' : dark ? 'text-gray-100' : 'text-gray-700'
      }`}>
        {highlightText(todo.title, searchQuery)}
      </span>

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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('darkMode', dark);
  }, [dark]);

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

  // 검색 필터링
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      dark ? 'bg-gray-900' : 'bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100'
    } flex items-center justify-center p-6`}>

      {!dark && <>
        <div className="fixed top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="fixed bottom-10 right-10 w-48 h-48 bg-violet-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
      </>}

      <div className={`backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-8 border relative transition-colors duration-500 ${
        dark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/60'
      }`}>

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-xl shadow-md">
                ✨
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                Todo List
              </h1>
            </div>
            <button
              onClick={() => setDark(!dark)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${
                dark
                  ? 'bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>

          <p className="text-sm text-gray-400 ml-1 mt-1">
            총 {todos.length}개 · 완료 {completedCount}개
          </p>

          {todos.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>진행률</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>
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
        <form onSubmit={addTodo} className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="✏️  새로운 할 일을 입력해요..."
            className={`flex-1 border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-200 placeholder-gray-300 ${
              dark
                ? 'bg-gray-700 border-gray-600 text-gray-100 focus:bg-gray-600'
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white'
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            style={{ transition: 'all 0.2s', transform: adding ? 'scale(0.92)' : 'scale(1)' }}
            className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg disabled:shadow-none transition-all duration-200"
          >
            추가
          </button>
        </form>

        {/* 검색창 */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="할 일 검색..."
            className={`w-full border rounded-2xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-200 placeholder-gray-300 ${
              dark
                ? 'bg-gray-700 border-gray-600 text-gray-100 focus:bg-gray-600'
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Todo 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-violet-300 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm mt-3">불러오는 중...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-14">
            <div className="text-5xl mb-3">{searchQuery ? '🔍' : '🌈'}</div>
            <p className={`text-sm font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {searchQuery ? `"${searchQuery}" 검색 결과가 없어요!` : '할 일을 추가해봐요!'}
            </p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-xs text-gray-400 mb-2 ml-1">
                "{searchQuery}" 검색 결과 {filteredTodos.length}개
              </p>
            )}
            <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredTodos.map((todo, i) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  colorClass={COLORS[i % COLORS.length]}
                  dark={dark}
                  searchQuery={searchQuery}
                />
              ))}
            </ul>
          </>
        )}

        {completedCount > 0 && (
          <button
            onClick={async () => {
              const completed = todos.filter(t => t.completed);
              await Promise.all(completed.map(t => axios.delete(`${API_URL}/api/todos/${t._id}`)));
              setTodos(todos.filter(t => !t.completed));
            }}
            className={`mt-5 w-full py-2.5 text-xs font-semibold rounded-2xl transition-all duration-200 border border-dashed ${
              dark
                ? 'text-gray-500 hover:text-red-400 bg-gray-700/50 hover:bg-red-900/20 border-gray-600 hover:border-red-800'
                : 'text-gray-400 hover:text-red-400 bg-gray-50 hover:bg-red-50 border-gray-200 hover:border-red-200'
            }`}
          >
            🗑️ 완료된 항목 모두 삭제 ({completedCount}개)
          </button>
        )}
      </div>
    </div>
  );
}

export default App;