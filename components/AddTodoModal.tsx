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
} from 'react-native';
import { theme } from '../styles/theme';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTodo: (text: string) => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ visible, onClose, onAddTodo }) => {
  const [todoText, setTodoText] = useState('');

  const handleAddTodo = () => {
    if (todoText.trim().length === 0) {
      Alert.alert('알림', '할 일을 입력해주세요.');
      return;
    }

    if (todoText.trim().length > 100) {
      Alert.alert('알림', '할 일은 100자 이내로 입력해주세요.');
      return;
    }

    onAddTodo(todoText.trim());
    setTodoText('');
    onClose();
  };

  const handleCancel = () => {
    setTodoText('');
    onClose();
  };

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
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 입력 필드 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>할 일</Text>
              <TextInput
                style={styles.textInput}
                placeholder="무엇을 해야 하나요?"
                value={todoText}
                onChangeText={setTodoText}
                multiline={true}
                numberOfLines={3}
                maxLength={100}
                autoFocus={true}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <Text style={styles.charCount}>
                {todoText.length}/100
              </Text>
            </View>

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
                  todoText.trim().length === 0 && styles.addButtonDisabled
                ]} 
                onPress={handleAddTodo}
                disabled={todoText.trim().length === 0}
              >
                <Text style={[
                  styles.addButtonText,
                  todoText.trim().length === 0 && styles.addButtonTextDisabled
                ]}>
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
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
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
  inputContainer: {
    marginBottom: theme.spacing.xxl,
  },
  label: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    textAlignVertical: 'top',
    minHeight: 80,
    maxHeight: 120,
  },
  charCount: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
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