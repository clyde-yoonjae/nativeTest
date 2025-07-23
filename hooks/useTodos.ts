import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Todo, saveTodos, loadTodos } from '../utils/storage';

// 초기화 함수 분리
const initializeTodos = async (): Promise<Todo[]> => {
  try {
    const loadedTodos = await loadTodos();
    return loadedTodos;
  } catch (error) {
    console.error('할일 목록 불러오기 실패:', error);
    Alert.alert('오류', '할일 목록을 불러오는데 실패했습니다.');
    throw error;
  }
};

// 할일 저장 함수 분리
const persistTodos = async (todos: Todo[]): Promise<void> => {
  try {
    await saveTodos(todos);
  } catch (error) {
    console.error('할일 저장 실패:', error);
    Alert.alert('오류', '할일을 저장하는데 실패했습니다.');
  }
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작시 데이터 불러오기 (분리된 함수 사용)
  useEffect(() => {
    let isMounted = true; // cleanup 방지

    initializeTodos()
      .then(loadedTodos => {
        if (isMounted) {
          setTodos(loadedTodos);
        }
      })
      .catch(() => {
        // 에러는 이미 initializeTodos에서 처리됨
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // todos가 변경될 때마다 저장 (debounce 효과)
  useEffect(() => {
    if (!isLoading && todos.length >= 0) {
      const timeoutId = setTimeout(() => {
        persistTodos(todos);
      }, 300); // 300ms 후에 저장 (너무 자주 저장하지 않도록)

      return () => clearTimeout(timeoutId);
    }
  }, [todos, isLoading]);

  // 할일 추가
  const addTodo = useCallback((text: string): void => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 더 안전한 ID 생성
      text: trimmedText,
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  }, []);

  // 할일 완료 상태 토글
  const toggleTodo = useCallback((id: string): void => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // 할일 삭제
  const deleteTodo = useCallback((id: string): void => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  // 할일 수정
  const updateTodo = useCallback((id: string, newText: string): void => {
    const trimmedText = newText.trim();
    if (!trimmedText) return;

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    );
  }, []);

  // 완료된 할일들 삭제
  const clearCompletedTodos = useCallback((): void => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  // 통계 계산 (useMemo로 최적화)
  const stats = useMemo(() => {
    const totalCount = todos.length;
    const completedCount = todos.filter(todo => todo.completed).length;
    const pendingCount = totalCount - completedCount;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return {
      totalCount,
      completedCount,
      pendingCount,
      completionRate,
    };
  }, [todos]);

  // 오늘 할일만 필터링 (useMemo로 최적화)
  const todayTodos = useMemo((): Todo[] => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    return todos.filter(todo => {
      const todoDate = new Date(todo.createdAt);
      return todoDate >= todayStart && todoDate < todayEnd;
    });
  }, [todos]);

  // 이번 주 할일 필터링
  const weekTodos = useMemo((): Todo[] => {
    const today = new Date();
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return todos.filter(todo => {
      const todoDate = new Date(todo.createdAt);
      return todoDate >= weekStart && todoDate <= today;
    });
  }, [todos]);

  // 완료된 할일만 필터링
  const completedTodos = useMemo((): Todo[] => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  // 미완료된 할일만 필터링
  const pendingTodos = useMemo((): Todo[] => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  return {
    // 데이터
    todos,
    todayTodos,
    weekTodos,
    completedTodos,
    pendingTodos,
    stats,
    isLoading,
    
    // 액션들
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompletedTodos,
  };
};

export default useTodos;