import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { theme } from '../styles/theme';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTodo: (title: string, content?: string, dueDate?: Date) => void;
  defaultDate?: Date; // HomeScreen의 현재 날짜를 기본값으로 받기
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({
  visible,
  onClose,
  onAddTodo,
  defaultDate = new Date(),
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  // 날짜 포맷팅 함수
  const formatDateForDisplay = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) return '오늘';
    if (isSameDay(date, tomorrow)) return '내일';
    if (isSameDay(date, yesterday)) return '어제';

    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 날짜 변경 함수들
  const goToPreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  const goToNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleAddTodo = () => {
    if (title.trim().length === 0) {
      Alert.alert('알림', '할 일 제목을 입력해주세요.');
      return;
    }

    if (title.trim().length > 50) {
      Alert.alert('알림', '제목은 50자 이내로 입력해주세요.');
      return;
    }

    if (content.trim().length > 200) {
      Alert.alert('알림', '내용은 200자 이내로 입력해주세요.');
      return;
    }

    onAddTodo(title.trim(), content.trim() || undefined, selectedDate);
    handleCancel();
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedDate(defaultDate);
    onClose();
  };

  // 모달이 열릴 때마다 기본 날짜 재설정
  React.useEffect(() => {
    if (visible) {
      setSelectedDate(defaultDate);
    }
  }, [visible, defaultDate]);

  const isFormValid = title.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.title}>새 할 일 추가</Text>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* 제목 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>제목 *</Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="할 일 제목을 입력하세요"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={50}
                  autoFocus={true}
                  returnKeyType="next"
                />
                <Text style={styles.charCount}>{title.length}/50</Text>
              </View>

              {/* 내용 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>상세 내용</Text>
                <TextInput
                  style={styles.contentInput}
                  placeholder="상세 내용을 입력하세요 (선택사항)"
                  value={content}
                  onChangeText={setContent}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={200}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{content.length}/200</Text>
              </View>

              {/* 날짜 선택 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>날짜</Text>

                {/* 오늘 버튼 */}
                <TouchableOpacity
                  onPress={goToToday}
                  style={styles.todayButton}
                >
                  <Text style={styles.todayButtonText}>오늘로 설정</Text>
                </TouchableOpacity>

                {/* 날짜 네비게이션 */}
                <View style={styles.dateNavigation}>
                  <TouchableOpacity
                    onPress={goToPreviousDay}
                    style={styles.dateNavButton}
                  >
                    <Text style={styles.dateNavButtonText}>‹</Text>
                  </TouchableOpacity>

                  <View style={styles.selectedDateContainer}>
                    <Text style={styles.selectedDateText}>
                      {formatDateForDisplay(selectedDate)}
                    </Text>
                    <Text style={styles.selectedDateSubtext}>
                      {selectedDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={goToNextDay}
                    style={styles.dateNavButton}
                  >
                    <Text style={styles.dateNavButtonText}>›</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* 버튼들 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  !isFormValid && styles.addButtonDisabled,
                ]}
                onPress={handleAddTodo}
                disabled={!isFormValid}
              >
                <Text
                  style={[
                    styles.addButtonText,
                    !isFormValid && styles.addButtonTextDisabled,
                  ]}
                >
                  추가
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    maxHeight: '85%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
  },
  formContainer: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  titleInput: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
    minHeight: 48,
  },
  contentInput: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
    minHeight: 100,
    maxHeight: 120,
  },
  charCount: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  todayButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  todayButtonText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.medium,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  dateNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.small,
  },
  dateNavButtonText: {
    fontSize: 20,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.bold,
  },
  selectedDateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
  },
  selectedDateSubtext: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.secondary,
  },
  addButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  addButtonText: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.surface,
  },
  addButtonTextDisabled: {
    color: theme.colors.text.tertiary,
  },
});

export default AddTodoModal;
