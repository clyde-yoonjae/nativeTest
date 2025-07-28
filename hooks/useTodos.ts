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

// 날짜 비교 헬퍼 함수
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작시 데이터 불러오기
  useEffect(() => {
    let isMounted = true;

    initializeTodos()
      .then((loadedTodos) => {
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

  // todos가 변경될 때마다 저장
  useEffect(() => {
    if (!isLoading && todos.length >= 0) {
      const timeoutId = setTimeout(() => {
        persistTodos(todos);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [todos, isLoading]);

  // 할일 추가 (새로운 구조)
  const addTodo = useCallback((title: string, content?: string, dueDate?: Date): void => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: trimmedTitle,
      content: content?.trim() || '',
      completed: false,
      createdAt: new Date(),
      dueDate: dueDate || new Date(), // 기본값은 오늘
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  }, []);

  // 할일 완료 상태 토글
  const toggleTodo = useCallback((id: string): void => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // 할일 삭제
  const deleteTodo = useCallback((id: string): void => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  // 할일 수정 (새로운 구조)
  const updateTodo = useCallback((
    id: string, 
    title?: string, 
    content?: string, 
    dueDate?: Date
  ): void => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            ...(title !== undefined && { title: title.trim() }),
            ...(content !== undefined && { content: content.trim() }),
            ...(dueDate !== undefined && { dueDate }),
          };
        }
        return todo;
      })
    );
  }, []);

  // 할일을 다음날로 이동
  const moveTodoToNextDay = useCallback((id: string): void => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          const nextDay = new Date(todo.dueDate);
          nextDay.setDate(nextDay.getDate() + 1);
          return { ...todo, dueDate: nextDay };
        }
        return todo;
      })
    );
  }, []);

  // 완료된 할일들 삭제
  const clearCompletedTodos = useCallback((): void => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  }, []);

  // 전체 통계 계산
  const stats = useMemo(() => {
    const totalCount = todos.length;
    const completedCount = todos.filter((todo) => todo.completed).length;
    const pendingCount = totalCount - completedCount;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return {
      totalCount,
      completedCount,
      pendingCount,
      completionRate,
    };
  }, [todos]);

  // 특정 날짜의 할일 가져오기 (메인 화면용)
  const getTodosByDate = useCallback((date: Date): Todo[] => {
    return todos.filter((todo) => isSameDay(todo.dueDate, date));
  }, [todos]);

  // 특정 날짜의 통계 계산
  const getStatsByDate = useCallback((date: Date) => {
    const dateTodos = getTodosByDate(date);
    const totalCount = dateTodos.length;
    const completedCount = dateTodos.filter((todo) => todo.completed).length;
    const pendingCount = totalCount - completedCount;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return {
      totalCount,
      completedCount,
      pendingCount,
      completionRate,
    };
  }, [getTodosByDate]);

  return {
    // 전체 데이터 (캘린더 화면용)
    todos,
    isLoading,

    // 전체 통계
    stats,

    // 메인 화면용 함수들
    getTodosByDate,      // 특정 날짜의 할일 가져오기
    getStatsByDate,      // 특정 날짜의 통계 계산

    // 액션들
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    moveTodoToNextDay,
    clearCompletedTodos,
  };
};

export default useTodos;