import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import useTodos from '../hooks/useTodos';
import { formatDate, getGreeting } from '../utils/dateUtils';
import AddTodoModal from '../components/AddTodoModal';
import SwipeableTodoItem from '../components/SwipeableTodoItem';
import {
  LoadingCard,
  LoadingSection,
  LoadingButton,
} from '../components/LoadingComponents';

const HomeScreen: React.FC = () => {
  const { todos, stats, isLoading, addTodo, toggleTodo, deleteTodo } =
    useTodos();

  const [isModalVisible, setIsModalVisible] = useState(false);

  // 함수들을 useCallback으로 최적화
  const openModal = useCallback(() => setIsModalVisible(true), []);
  const closeModal = useCallback(() => setIsModalVisible(false), []);

  // 오늘 날짜를 useMemo로 최적화 (하루에 한 번만 계산)
  const today = useMemo(() => new Date(), []);

  // 테스트용 강제 로딩 (나중에 제거 예정)
  const [isTestLoading, setIsTestLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTestLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const showLoading = isLoading || isTestLoading;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* 헤더 - 항상 먼저 보여줌 (로딩과 무관) */}
          <View style={styles.header}>
            <Text style={styles.dateText}>{formatDate(today)}</Text>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
          </View>

          {/* 진행 상황 카드 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>오늘의 진행 상황</Text>
            {showLoading ? (
              <LoadingCard
                message="진행 상황을 불러오는 중..."
                size="small"
                minHeight={80}
              />
            ) : (
              <>
                <Text style={styles.progressText}>
                  {stats.completedCount}/{stats.totalCount} 완료
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${stats.completionRate}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {Math.round(stats.completionRate)}% 완료
                </Text>
              </>
            )}
          </View>

          {/* 할 일 목록 섹션 */}
          <Text style={styles.sectionTitle}>
            전체 할 일 {showLoading ? '' : `(${todos.length})`}
          </Text>

          {/* 할 일 목록 */}
          {showLoading ? (
            <LoadingSection
              message="할일 목록을 불러오는 중..."
              backgroundColor={theme.colors.surface}
              paddingVertical={theme.spacing.xxxl}
            />
          ) : todos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>할 일이 없습니다</Text>
              <Text style={styles.emptySubtitle}>
                새로운 할 일을 추가해보세요!
              </Text>
            </View>
          ) : (
            todos.map((todo) => (
              <SwipeableTodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}

          {/* 추가 버튼 */}
          <LoadingButton
            isLoading={showLoading}
            onPress={openModal}
            loadingText="로딩 중..."
            normalText="+ 새 할 일 추가"
            style={styles.addButton}
          />

          {/* 할일 추가 모달 */}
          <AddTodoModal
            visible={isModalVisible}
            onClose={closeModal}
            onAddTodo={addTodo}
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  dateText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  greetingText: {
    fontSize: theme.typography.size.title,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    ...theme.shadow.medium,
    minHeight: 120,
  },
  cardTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: theme.typography.size.xxl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl * 2,
  },
  emptyTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.tertiary,
  },
  addButton: {
    // LoadingButton 컴포넌트의 기본 스타일 사용
  },
});

export default HomeScreen;
