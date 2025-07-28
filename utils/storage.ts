import AsyncStorage from '@react-native-async-storage/async-storage';

// 스토리지 키 상수
const STORAGE_KEYS = {
  TODOS: '@todoapp_todos',
} as const;

// Todo 타입
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// 할일 목록 저장
export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEYS.TODOS, jsonValue);
  } catch (error) {
    console.error('할일 저장 실패:', error);
    throw new Error('할일을 저장하는데 실패했습니다.');
  }
};

// 할일 목록 불러오기
export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TODOS);
    if (jsonValue === null) {
      // 초기 데이터 반환
      return getInitialTodos();
    }

    const parsed = JSON.parse(jsonValue);
    // Date 객체로 변환
    return parsed.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  } catch (error) {
    console.error('할일 불러오기 실패:', error);
    // 에러 발생시 초기 데이터 반환
    return getInitialTodos();
  }
};

// 초기 데이터
const getInitialTodos = (): Todo[] => [
  {
    id: '1',
    text: '프로젝트 기획서 작성',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    text: '운동하기',
    completed: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    text: '책 읽기',
    completed: false,
    createdAt: new Date(),
  },
];

// 스토리지 초기화 (개발용)
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TODOS);
  } catch (error) {
    console.error('스토리지 초기화 실패:', error);
  }
};
