# Phase 8: 할 일 목록

## 목표
간단한 체크리스트 형태의 할 일 목록을 구현합니다.

## 작업 내용

### 1. TodoList 컴포넌트 생성
`src/components/TodoList/TodoList.jsx`와 `TodoList.module.css` 생성

#### Todo 데이터 구조
```javascript
{
  id: 'unique-id',
  text: '운동하기',
  completed: false,
  createdAt: 1234567890,
  completedAt: null
}
```

#### 컴포넌트 구조
```javascript
const TodoList = () => {
  const { todos, addTodo, toggleTodo, removeTodo } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo({
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        createdAt: Date.now(),
        completedAt: null
      });
      setInputValue('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;

  return (
    <div className={styles.todoContainer}>
      <div className={styles.header}>
        <h3>할 일</h3>
        <span className={styles.count}>{activeTodosCount}개 남음</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          placeholder="새로운 할 일을 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          maxLength={100}
        />
        <button type="submit">추가</button>
      </form>

      <div className={styles.filters}>
        <button
          className={filter === 'all' ? styles.active : ''}
          onClick={() => setFilter('all')}
        >
          전체
        </button>
        <button
          className={filter === 'active' ? styles.active : ''}
          onClick={() => setFilter('active')}
        >
          진행중
        </button>
        <button
          className={filter === 'completed' ? styles.active : ''}
          onClick={() => setFilter('completed')}
        >
          완료
        </button>
      </div>

      <div className={styles.todoList}>
        {filteredTodos.length === 0 ? (
          <div className={styles.empty}>할 일이 없습니다</div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onRemove={removeTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};
```

### 2. TodoItem 컴포넌트
`src/components/TodoList/TodoItem.jsx`

```javascript
const TodoItem = ({ todo, onToggle, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className={styles.checkmark}></span>
      </label>

      <span className={styles.todoText}>{todo.text}</span>

      {isHovered && (
        <button
          className={styles.deleteBtn}
          onClick={() => onRemove(todo.id)}
          aria-label="삭제"
        >
          ×
        </button>
      )}
    </div>
  );
};
```

### 3. CSS 스타일링
`TodoList.module.css`

```css
.todoContainer {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.count {
  font-size: 14px;
  color: #666;
}

.inputForm {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.inputForm input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.inputForm button {
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.filters button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.filters button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.todoList {
  max-height: 300px;
  overflow-y: auto;
}

.todoItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.todoItem:hover {
  background: #f9fafb;
}

.todoItem.completed .todoText {
  text-decoration: line-through;
  color: #999;
}

.checkbox {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox input:checked ~ .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox input:checked ~ .checkmark::after {
  content: '✓';
  color: white;
  font-size: 14px;
}

.todoText {
  flex: 1;
  font-size: 14px;
  word-break: break-word;
}

.deleteBtn {
  width: 24px;
  height: 24px;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.deleteBtn:hover {
  opacity: 1;
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}
```

### 4. Context에서 Todo 관리
`AppContext.js`에 할 일 관리 함수 추가

```javascript
const addTodo = (todo) => {
  setState(prev => ({
    ...prev,
    todos: [...prev.todos, todo]
  }));
};

const toggleTodo = (id) => {
  setState(prev => ({
    ...prev,
    todos: prev.todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? Date.now() : null
          }
        : todo
    )
  }));
};

const removeTodo = (id) => {
  setState(prev => ({
    ...prev,
    todos: prev.todos.filter(todo => todo.id !== id)
  }));
};

const clearCompletedTodos = () => {
  setState(prev => ({
    ...prev,
    todos: prev.todos.filter(todo => !todo.completed)
  }));
};
```

### 5. 추가 기능 (선택사항)
#### 완료된 항목 일괄 삭제
```javascript
<button onClick={clearCompletedTodos} className={styles.clearCompleted}>
  완료된 항목 삭제
</button>
```

#### 할 일 편집
```javascript
const [editingId, setEditingId] = useState(null);
const [editValue, setEditValue] = useState('');

const startEdit = (todo) => {
  setEditingId(todo.id);
  setEditValue(todo.text);
};

const saveEdit = () => {
  updateTodo(editingId, { text: editValue });
  setEditingId(null);
};
```

#### 우선순위 기능
```javascript
{
  id: 'unique-id',
  text: '운동하기',
  completed: false,
  priority: 'high', // 'high' | 'medium' | 'low'
  createdAt: 1234567890
}
```

### 6. App.js에 TodoList 추가
```javascript
import TodoList from './components/TodoList/TodoList';

function App() {
  const { widgets } = useSettings();

  return (
    <AppProvider>
      <Background />
      {widgets.clock.enabled && <Clock />}
      {widgets.weather.enabled && <Weather />}
      {widgets.quote.enabled && <Quote />}
      {widgets.bookmarks.enabled && <Bookmarks />}
      {widgets.todoList.enabled && <TodoList />}
    </AppProvider>
  );
}
```

## 완료 조건
- [ ] 할 일 추가가 작동함
- [ ] 체크박스로 완료 표시가 가능함
- [ ] 할 일 삭제가 작동함
- [ ] 필터링(전체/진행중/완료)이 작동함
- [ ] 남은 할 일 개수가 표시됨
- [ ] 데이터가 localStorage에 저장됨
- [ ] 스크롤이 필요한 경우 표시됨

## 주의사항
- 할 일 최대 개수 제한 고려 (예: 50개)
- 긴 텍스트 처리 (word-break)
- 빈 입력 방지
- XSS 방지 (텍스트 sanitization)

## 개선 아이디어
- [ ] 드래그 앤 드롭으로 순서 변경
- [ ] 할 일 편집 기능
- [ ] 우선순위 설정
- [ ] 기한 설정
- [ ] 카테고리/태그
- [ ] 검색 기능
- [ ] 통계 (완료율 등)

## 다음 단계
Phase 9: 설정 모달 구현
