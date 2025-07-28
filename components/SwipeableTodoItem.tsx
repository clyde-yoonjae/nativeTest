import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import { formatDate } from '../utils/dateUtils';
import { Todo } from '../utils/storage';

interface SwipeableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = -80; // 삭제되는 임계점

const SwipeableTodoItem: React.FC<SwipeableTodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // 수평 스와이프만 감지 (수직 스크롤 방해하지 않도록)
      return (
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        Math.abs(gestureState.dx) > 10
      );
    },

    onPanResponderMove: (_, gestureState) => {
      // 왼쪽으로만 스와이프 가능
      if (gestureState.dx < 0) {
        translateX.setValue(gestureState.dx);
      }
    },

    onPanResponderRelease: (_, gestureState) => {
      const shouldDelete = gestureState.dx < SWIPE_THRESHOLD;

      if (shouldDelete) {
        // 삭제 확인 후 애니메이션
        Alert.alert('할일 삭제', `"${todo.text}"를 삭제하시겠습니까?`, [
          {
            text: '취소',
            onPress: () => {
              // 원래 위치로 복귀
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            },
          },
          {
            text: '삭제',
            style: 'destructive',
            onPress: () => {
              // 삭제 애니메이션
              deleteAnimation();
            },
          },
        ]);
      } else {
        // 원래 위치로 복귀
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const deleteAnimation = () => {
    // 애니메이션으로 아이템을 축소하고 페이드아웃
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후 실제 삭제
      onDelete(todo.id);
    });
  };

  const deleteIconOpacity = translateX.interpolate({
    inputRange: [-100, SWIPE_THRESHOLD, 0],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const deleteIconScale = translateX.interpolate({
    inputRange: [-100, SWIPE_THRESHOLD, 0],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale }],
          opacity: opacity,
        },
      ]}
    >
      {/* 삭제 버튼 배경 */}
      <View style={styles.deleteBackground}>
        <Animated.View
          style={[
            styles.deleteIconContainer,
            {
              opacity: deleteIconOpacity,
              transform: [{ scale: deleteIconScale }],
            },
          ]}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text style={styles.deleteText}>삭제</Text>
        </Animated.View>
      </View>

      {/* 할일 아이템 */}
      <Animated.View
        style={[
          styles.todoItem,
          todo.completed && styles.todoCompleted,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.todoContent}
          onPress={() => onToggle(todo.id)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              todo.completed && styles.checkboxCompleted,
            ]}
          >
            {todo.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.todoTextContainer}>
            <Text
              style={[
                styles.todoText,
                todo.completed && styles.todoTextCompleted,
              ]}
            >
              {todo.text}
            </Text>
            <Text style={styles.todoDate}>{formatDate(todo.createdAt)}</Text>
          </View>
        </TouchableOpacity>

        {/* 스와이프 힌트 */}
        <View style={styles.swipeHint}>
          <Text style={styles.swipeHintText}>←</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  deleteIconContainer: {
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
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
  todoContent: {
    flex: 1,
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
  swipeHint: {
    paddingLeft: theme.spacing.sm,
  },
  swipeHintText: {
    fontSize: 18,
    color: theme.colors.text.tertiary,
  },
});

export default SwipeableTodoItem;
