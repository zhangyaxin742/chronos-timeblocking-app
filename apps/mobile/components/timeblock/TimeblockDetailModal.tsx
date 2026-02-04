import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChronosStore } from '../../store';
import type { Timeblock } from '@chronos/shared';

interface TimeblockDetailModalProps {
  visible: boolean;
  onClose: () => void;
  timeblock: Timeblock | null;
}

export function TimeblockDetailModal({ visible, onClose, timeblock }: TimeblockDetailModalProps) {
  const { updateTimeblock, deleteTimeblock, createTask, toggleTaskComplete, deleteTask } = useChronosStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  if (!timeblock) return null;

  const handleEdit = () => {
    setTitle(timeblock.title);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    await updateTimeblock(timeblock.id, { title: title.trim() });
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Timeblock',
      'Are you sure you want to delete this timeblock?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTimeblock(timeblock.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await createTask({
      title: newTaskTitle.trim(),
      timeblock_id: timeblock.id,
      category_id: timeblock.category_id,
    });
    setNewTaskTitle('');
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Timeblock Details</Text>
            <View style={styles.headerActions}>
              {!isEditing && (
                <Pressable onPress={handleEdit} style={styles.iconButton}>
                  <Ionicons name="pencil-outline" size={20} color="#E8E8E8" />
                </Pressable>
              )}
              <Pressable onPress={handleDelete} style={styles.iconButton}>
                <Ionicons name="trash-outline" size={20} color="#E8E8E8" />
              </Pressable>
              <Pressable onPress={onClose} style={styles.iconButton}>
                <Ionicons name="close" size={24} color="#E8E8E8" />
              </Pressable>
            </View>
          </View>

          <ScrollView style={styles.content}>
            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.label}>Title</Text>
              {isEditing ? (
                <View style={styles.editRow}>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={[styles.input, { flex: 1 }]}
                    autoFocus
                  />
                  <Pressable onPress={handleSave} style={styles.saveButton}>
                    <Ionicons name="checkmark" size={20} color="#0D0D0D" />
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.value}>{timeblock.title}</Text>
              )}
            </View>

            {/* Time */}
            <View style={styles.section}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>
                {timeblock.start_time} - {timeblock.end_time}
              </Text>
            </View>

            {/* Category */}
            {timeblock.category && (
              <View style={styles.section}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>{timeblock.category.name}</Text>
              </View>
            )}

            {/* Tasks */}
            <View style={styles.section}>
              <Text style={styles.label}>Tasks ({timeblock.tasks?.length || 0})</Text>
              
              {/* Add Task */}
              <View style={styles.addTaskRow}>
                <TextInput
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  placeholder="Add a task..."
                  placeholderTextColor="#666666"
                  style={[styles.input, { flex: 1 }]}
                  onSubmitEditing={handleAddTask}
                />
                <Pressable onPress={handleAddTask} style={styles.addButton}>
                  <Ionicons name="add" size={20} color="#0D0D0D" />
                </Pressable>
              </View>

              {/* Task List */}
              {timeblock.tasks && timeblock.tasks.length > 0 && (
                <View style={styles.taskList}>
                  {timeblock.tasks.map((task: any) => (
                    <View key={task.id} style={styles.taskRow}>
                      <Pressable
                        onPress={() => toggleTaskComplete(task.id)}
                        style={styles.checkbox}
                      >
                        {task.is_completed && (
                          <Ionicons name="checkmark" size={16} color="#E8E8E8" />
                        )}
                      </Pressable>
                      <Text
                        style={[
                          styles.taskText,
                          task.is_completed && styles.taskTextCompleted
                        ]}
                      >
                        {task.title}
                      </Text>
                      <Pressable onPress={() => handleDeleteTask(task.id)}>
                        <Ionicons name="close-circle-outline" size={18} color="#666666" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0D0D0D',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E8E8E8',
    fontFamily: 'monospace',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#888888',
    fontFamily: 'monospace',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    color: '#E8E8E8',
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 12,
    color: '#E8E8E8',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskList: {
    gap: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 12,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskText: {
    flex: 1,
    color: '#E8E8E8',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  taskTextCompleted: {
    color: '#666666',
    textDecorationLine: 'line-through',
  },
});
