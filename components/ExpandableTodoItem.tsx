import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import { theme } from '../styles/theme';
import { formatDate } from '../utils/dateUtils';
import { Todo } from '../utils/storage';

interface ExpandableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void; // TODO: 수정 기능 추가 예정
  onMoveToNextDay?: (id: string) => void; // TODO: 내일로 미루기 기능 추가 예정
}

const ExpandableTodoItem: React.FC<ExpandableTodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onMoveToNextDay,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleExpanded = () => {
    const willExpand = !isExpanded;
    setIsExpanded(willExpand);

    Animated.timing(animatedHeight, {
      toValue: willExpand ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleComplete = () => {
    onToggle(todo.id);
    // 완료 후 애니메이션과 함께 닫기
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(false);
    });
  };

  const handleEdit = () => {
    // TODO: 수정 모달 열기
    Alert.alert('수정', '수정 기능은 준비 중입니다.');
    // 액션 후 애니메이션과 함께 닫기
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(false);
    });
  };

  const handleMoveToNextDay = () => {
    // TODO: 내일로 미루기 기능
    Alert.alert('내일로 미루기', '내일로 미루기 기능은 준비 중입니다.');
    // 액션 후 애니메이션과 함께 닫기
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(false);
    });
  };

  const handleDelete = () => {
    Alert.alert('할일 삭제', `"${todo.title}"를 삭제하시겠습니까?`, [
      {
        text: '취소',
        style: 'cancel',
        onPress: () => {
          // 취소 시에는 확장 상태 유지
        },
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          // 삭제 전 애니메이션과 함께 닫기
          Animated.timing(animatedHeight, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            setIsExpanded(false);
            onDelete(todo.id);
          });
        },
      },
    ]);
  };

  // 동적 높이 계산
  const hasContent = todo.content && todo.content.trim().length > 0;

  const calculateExpandedHeight = () => {
    const baseHeight = 120; // 기본 높이 (날짜 정보 + 버튼들)

    if (!hasContent) {
      return baseHeight;
    }

    // 실제 줄 수 계산 (엔터와 자동 줄바꿈 모두 고려)
    const contentLength = todo.content?.length ?? 0;
    const lineHeight = 20; // 텍스트 라인 높이
    const charactersPerLine = 30; // 한 줄당 평균 글자수

    // 엔터로 인한 줄바꿈 계산
    const enterLines = todo.content?.split('\n').length ?? 1;

    // 긴 텍스트로 인한 자동 줄바꿈 계산
    const autoWrapLines = Math.ceil(contentLength / charactersPerLine);

    // 실제 줄 수는 둘 중 더 큰 값
    const actualLines = Math.max(enterLines, autoWrapLines);

    // 최소 3줄, 최대 제한 없음 (컨텐츠 전체 표시)
    const finalLines = Math.max(3, actualLines);
    const contentHeight = finalLines * lineHeight + 40; // 패딩 포함

    return baseHeight + contentHeight;
  };

  // 확장된 높이 계산 (동적으로 조정)
  const expandedHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, calculateExpandedHeight()],
  });

  const expandedOpacity = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* 메인 아이템 */}
      <TouchableOpacity
        style={[
          styles.todoItem,
          todo.completed && styles.todoCompleted,
          isExpanded && styles.todoExpanded,
        ]}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.todoContent}>
          <View
            style={[
              styles.checkbox,
              todo.completed && styles.checkboxCompleted,
            ]}
          >
            {todo.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>

          <Text
            style={[
              styles.todoTitle,
              todo.completed && styles.todoTitleCompleted,
            ]}
          >
            {todo.title}
          </Text>
        </View>

        {/* 확장 인디케이터 */}
        <Text style={styles.expandIndicator}>{isExpanded ? '⌄' : '⌃'}</Text>
      </TouchableOpacity>

      {/* 확장된 영역 */}
      <Animated.View
        style={[
          styles.expandedContainer,
          {
            height: expandedHeight,
            opacity: expandedOpacity,
          },
        ]}
      >
        <View style={styles.expandedContent}>
          {/* 상세 정보 */}
          <View style={styles.detailsSection}>
            {hasContent && (
              <View style={styles.contentContainer}>
                <Text style={styles.contentLabel}>상세 내용</Text>
                <Text style={styles.contentText}>{todo.content}</Text>
              </View>
            )}

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>마감일</Text>
              <Text style={styles.dateText}>{formatDate(todo.dueDate)}</Text>
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>생성일</Text>
              <Text style={styles.dateText}>{formatDate(todo.createdAt)}</Text>
            </View>
          </View>

          {/* 액션 버튼들 */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.completeButton,
                todo.completed && styles.completedButton,
              ]}
              onPress={handleComplete}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  styles.completeButtonText,
                  todo.completed && styles.completedButtonText,
                ]}
              >
                {todo.completed ? '완료 취소' : '완료'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
            >
              <Text style={[styles.actionButtonText, styles.editButtonText]}>
                수정
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.moveButton]}
              onPress={handleMoveToNextDay}
            >
              <Text style={[styles.actionButtonText, styles.moveButtonText]}>
                내일로
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                삭제
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  todoItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadow.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoCompleted: {
    opacity: 0.7,
  },
  todoExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  todoContent: {
    flex: 1,
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
  todoTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text.primary,
    flex: 1,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.secondary,
  },
  expandIndicator: {
    fontSize: 16,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing.sm,
  },
  expandedContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  expandedContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  detailsSection: {
    marginBottom: theme.spacing.lg,
  },
  contentContainer: {
    marginBottom: theme.spacing.md,
  },
  contentLabel: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  contentTextContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  contentText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  dateLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
  },
  dateText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.primary,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.medium,
  },
  completeButton: {
    backgroundColor: theme.colors.success,
  },
  completedButton: {
    backgroundColor: theme.colors.background,
  },
  completeButtonText: {
    color: theme.colors.surface,
  },
  completedButtonText: {
    color: theme.colors.text.secondary,
  },
  editButton: {
    backgroundColor: theme.colors.background,
  },
  editButtonText: {
    color: theme.colors.text.primary,
  },
  moveButton: {
    backgroundColor: theme.colors.warning,
  },
  moveButtonText: {
    color: theme.colors.surface,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  deleteButtonText: {
    color: theme.colors.surface,
  },
});

export default ExpandableTodoItem;
