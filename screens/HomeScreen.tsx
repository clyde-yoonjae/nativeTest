import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import useTodos from '../hooks/useTodos';
import { formatDate, getGreeting } from '../utils/dateUtils';
import AddTodoModal from '../components/AddTodoModal';

const HomeScreen: React.FC = () => {
  const { 
    todos, 
    stats,
    isLoading, 
    addTodo, 
    toggleTodo,
  } = useTodos();
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 함수들을 useCallback으로 최적화
  const openModal = useCallback(() => setIsModalVisible(true), []);
  const closeModal = useCallback(() => setIsModalVisible(false), []);

  // 오늘 날짜를 useMemo로 최적화 (하루에 한 번만 계산)
  const today = useMemo(() => new Date(), []);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>할일 목록을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(today)}</Text>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
        </View>

        {/* 진행 상황 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘의 진행 상황</Text>
          <Text style={styles.progressText}>
            {stats.completedCount}/{stats.totalCount} 완료
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${stats.completionRate}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(stats.completionRate)}% 완료
          </Text>
        </View>

        {/* 할 일 목록 */}
        <Text style={styles.sectionTitle}>
          전체 할 일 ({todos.length})
        </Text>
        
        {todos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>할 일이 없습니다</Text>
            <Text style={styles.emptySubtitle}>새로운 할 일을 추가해보세요!</Text>
          </View>
        ) : (
          todos.map((todo) => (
            <TouchableOpacity
              key={todo.id}
              style={[styles.todoItem, todo.completed && styles.todoCompleted]}
              onPress={() => toggleTodo(todo.id)}
            >
              <View style={styles.todoContent}>
                <View style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}>
                  {todo.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.todoTextContainer}>
                  <Text style={[styles.todoText, todo.completed && styles.todoTextCompleted]}>
                    {todo.text}
                  </Text>
                  <Text style={styles.todoDate}>
                    {formatDate(todo.createdAt)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* 추가 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>+ 새 할 일 추가</Text>
        </TouchableOpacity>

        {/* 할일 추가 모달 */}
        <AddTodoModal
          visible={isModalVisible}
          onClose={closeModal}
          onAddTodo={addTodo}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
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
  todoItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadow.small,
  },
  todoCompleted: {
    opacity: 0.7,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.text.tertiary,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    lineHeight: 22,
    marginBottom: theme.spacing.xs,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.secondary,
  },
  todoDate: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  addButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
  },
});

export default HomeScreen;