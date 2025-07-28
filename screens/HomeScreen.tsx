import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import useTodos from '../hooks/useTodos';
import { formatDate } from '../utils/dateUtils';
import AddTodoModal from '../components/AddTodoModal';
import ExpandableTodoItem from '../components/ExpandableTodoItem';
import {
  LoadingCard,
  LoadingSection,
  LoadingButton,
} from '../components/LoadingComponents';
import styles from './HomeScreen.styles';

const HomeScreen: React.FC = () => {
  const {
    getTodosByDate,
    getStatsByDate,
    addTodo,
    toggleTodo,
    deleteTodo,
    isLoading,
  } = useTodos();

  // 현재 선택된 날짜
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 현재 날짜의 할일들과 통계 (완료된 할일은 아래로 정렬)
  const currentTodos = useMemo(() => {
    const todos = getTodosByDate(currentDate);
    return todos.sort((a, b) => {
      // 완료되지 않은 할일을 위로, 완료된 할일을 아래로
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // 같은 완료 상태 내에서는 생성일 기준으로 최신순
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [getTodosByDate, currentDate]);

  const currentStats = useMemo(
    () => getStatsByDate(currentDate),
    [getStatsByDate, currentDate]
  );

  // 함수들을 useCallback으로 최적화
  const openModal = useCallback(() => setIsModalVisible(true), []);
  const closeModal = useCallback(() => setIsModalVisible(false), []);

  // 날짜 변경 함수들
  const goToPreviousDay = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  }, []);

  // 날짜 표시 함수
  const getDateDisplayText = (date: Date) => {
    const today = new Date();

    // 날짜 차이 계산 (시간 제외하고 날짜만)
    const getDaysDifference = (date1: Date, date2: Date) => {
      // 시간 부분을 제거하고 날짜만 비교
      const d1 = new Date(
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate()
      );
      const d2 = new Date(
        date2.getFullYear(),
        date2.getMonth(),
        date2.getDate()
      );

      // 밀리초 차이를 일 단위로 변환
      const timeDiff = d1.getTime() - d2.getTime();
      const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

      return dayDiff;
    };

    const daysDiff = getDaysDifference(date, today);

    // 날짜 차이에 따른 표시
    if (daysDiff === 0) return '오늘';
    if (daysDiff === -1) return '어제';
    if (daysDiff === 1) return '내일';
    if (daysDiff === -2) return '2일 전';
    if (daysDiff === 2) return '2일 후';
    if (daysDiff < -2) return `${Math.abs(daysDiff)}일 전`;
    if (daysDiff > 2) return `${daysDiff}일 후`;

    // 기본적으로는 실제 날짜 표시
    return formatDate(date);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 헤더 - 날짜 네비게이션 */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={goToPreviousDay}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
              <Text style={styles.greetingText}>
                {getDateDisplayText(currentDate)}
              </Text>
            </View>

            <TouchableOpacity onPress={goToNextDay} style={styles.navButton}>
              <Text style={styles.navButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* 진행 상황 카드 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>진행 상황</Text>
            {isLoading ? (
              <LoadingCard
                message="진행 상황을 불러오는 중..."
                size="small"
                minHeight={80}
              />
            ) : (
              <>
                <Text style={styles.progressText}>
                  {currentStats.completedCount}/{currentStats.totalCount} 완료
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${currentStats.completionRate}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {Math.round(currentStats.completionRate)}% 완료
                </Text>
              </>
            )}
          </View>

          {/* 새 할일 추가 버튼 */}
          <LoadingButton
            isLoading={isLoading}
            onPress={openModal}
            loadingText="로딩 중..."
            normalText="+ 새 할 일 추가"
            style={styles.addButton}
          />

          {/* 할 일 목록 섹션 */}
          <Text style={styles.sectionTitle}>
            할 일 목록 {isLoading ? '' : `(${currentTodos.length})`}
          </Text>

          {/* 할 일 목록 */}
          {isLoading ? (
            <LoadingSection
              message="할일 목록을 불러오는 중..."
              backgroundColor={theme.colors.surface}
              paddingVertical={theme.spacing.xxxl}
            />
          ) : currentTodos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>할 일이 없습니다</Text>
              <Text style={styles.emptySubtitle}>
                {getDateDisplayText(currentDate) === '오늘'
                  ? '새로운 할 일을 추가해보세요!'
                  : '이 날짜에는 할 일이 없네요'}
              </Text>
            </View>
          ) : (
            currentTodos.map((todo) => (
              <ExpandableTodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </ScrollView>

        {/* 할일 추가 모달 */}
        <AddTodoModal
          visible={isModalVisible}
          onClose={closeModal}
          onAddTodo={addTodo}
          defaultDate={currentDate}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;
