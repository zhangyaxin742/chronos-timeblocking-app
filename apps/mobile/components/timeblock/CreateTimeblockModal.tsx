import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChronosStore } from '../../store';

interface CreateTimeblockModalProps {
  visible: boolean;
  onClose: () => void;
  initialDate: string;
  initialTime?: string;
}

export function CreateTimeblockModal({ 
  visible, 
  onClose, 
  initialDate,
  initialTime = '09:00'
}: CreateTimeblockModalProps) {
  const { categories, createTimeblock } = useChronosStore();
  const [title, setTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [startTime, setStartTime] = useState(initialTime);
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !selectedCategoryId) return;

    setLoading(true);
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + duration);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    await createTimeblock({
      title: title.trim(),
      category_id: selectedCategoryId,
      date: initialDate,
      start_time: startTime,
      end_time: endTime,
      status: 'scheduled',
    });

    setLoading(false);
    setTitle('');
    setSelectedCategoryId('');
    setStartTime('09:00');
    setDuration(60);
    onClose();
  };

  const durationOptions = [15, 30, 45, 60, 90, 120, 180, 240];

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
            <Text style={styles.title}>New Timeblock</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#E8E8E8" />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Title */}
            <View style={styles.field}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="What are you working on?"
                placeholderTextColor="#666666"
                style={styles.input}
              />
            </View>

            {/* Category */}
            <View style={styles.field}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => setSelectedCategoryId(category.id)}
                    style={[
                      styles.categoryButton,
                      selectedCategoryId === category.id && styles.categoryButtonSelected
                    ]}
                  >
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Start Time */}
            <View style={styles.field}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                placeholder="09:00"
                placeholderTextColor="#666666"
                style={styles.input}
              />
            </View>

            {/* Duration */}
            <View style={styles.field}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <View style={styles.durationGrid}>
                {durationOptions.map((mins) => (
                  <Pressable
                    key={mins}
                    onPress={() => setDuration(mins)}
                    style={[
                      styles.durationButton,
                      duration === mins && styles.durationButtonSelected
                    ]}
                  >
                    <Text style={styles.durationText}>{mins}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleCreate}
              disabled={!title.trim() || !selectedCategoryId || loading}
              style={[
                styles.createButton,
                (!title.trim() || !selectedCategoryId || loading) && styles.createButtonDisabled
              ]}
            >
              <Text style={styles.createText}>
                {loading ? 'Creating...' : 'Create'}
              </Text>
            </Pressable>
          </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E8E8E8',
    fontFamily: 'monospace',
  },
  content: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#888888',
    fontFamily: 'monospace',
    marginBottom: 8,
    textTransform: 'uppercase',
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryButtonSelected: {
    backgroundColor: '#262626',
    borderColor: '#E8E8E8',
  },
  categoryText: {
    color: '#E8E8E8',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  durationButtonSelected: {
    backgroundColor: '#262626',
    borderColor: '#E8E8E8',
  },
  durationText: {
    color: '#E8E8E8',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#262626',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#E8E8E8',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createText: {
    color: '#0D0D0D',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
});
