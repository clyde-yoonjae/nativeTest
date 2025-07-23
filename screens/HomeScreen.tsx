import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const HomeScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: '프로젝트 기획서 작성', completed: false, createdAt: new Date() },
    { id: '2', text: '운동하기', completed: true, createdAt: new Date() },
    { id: '3', text: '책 읽기', completed: false, createdAt: new Date() },
  ]);

  const today = new Date();
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const toggleTodo = (id: string): void => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(today)}</Text>
          <Text style={styles.greetingText}>안녕하세요! 👋</Text>
        </View>

        {/* 진행 상황 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘의 진행 상황</Text>
          <Text style={styles.progressText}>{completedCount}/{totalCount} 완료</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* 할 일 목록 */}
        <Text style={styles.sectionTitle}>오늘 할 일</Text>
        
        {todos.map((todo) => (
          <TouchableOpacity
            key={todo.id}
            style={[styles.todoItem, todo.completed && styles.todoCompleted]}
            onPress={() => toggleTodo(todo.id)}
          >
            <View style={styles.todoContent}>
              <View style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}>
                {todo.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.todoText, todo.completed && styles.todoTextCompleted]}>
                {todo.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* 추가 버튼 */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 새 할 일 추가</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
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
    alignItems: 'center',
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
  todoText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.secondary,
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