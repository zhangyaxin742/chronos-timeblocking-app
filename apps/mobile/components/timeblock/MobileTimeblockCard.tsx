import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Timeblock } from '@chronos/shared';
import { TIME_GRID } from '@chronos/shared';

interface MobileTimeblockCardProps {
  timeblock: Timeblock;
  onPress: () => void;
  onLongPress?: () => void;
}

export function MobileTimeblockCard({ timeblock, onPress, onLongPress }: MobileTimeblockCardProps) {
  const calculatePosition = () => {
    const [hours, minutes] = timeblock.start_time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const slots = totalMinutes / 15;
    return slots * TIME_GRID.SLOT_HEIGHT;
  };

  const calculateHeight = () => {
    const durationMinutes = timeblock.duration_minutes || 60;
    const slots = durationMinutes / 15;
    return slots * TIME_GRID.SLOT_HEIGHT;
  };

  const getBorderStyle = () => {
    const category = timeblock.category;
    if (!category) return 'solid';
    
    const styles: Record<string, 'solid' | 'dashed' | 'dotted'> = {
      'Work': 'solid',
      'Personal': 'dashed',
      'Focus': 'solid',
      'Health': 'dotted',
    };
    
    return styles[category.name] || 'solid';
  };

  const top = calculatePosition();
  const height = calculateHeight();
  const borderStyle = getBorderStyle();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        {
          top,
          height,
          borderStyle: borderStyle as any,
        }
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {timeblock.title}
        </Text>
        <Text style={styles.time}>
          {timeblock.start_time} - {timeblock.end_time}
        </Text>
        
        {/* Tasks */}
        {height >= TIME_GRID.SLOT_HEIGHT * 3 && timeblock.tasks && timeblock.tasks.length > 0 && (
          <View style={styles.tasksContainer}>
            {timeblock.tasks.slice(0, 3).map((task: any) => (
              <View key={task.id} style={styles.taskRow}>
                <Ionicons 
                  name={task.is_completed ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={12} 
                  color="#888888" 
                />
                <Text style={styles.taskText} numberOfLines={1}>
                  {task.title}
                </Text>
              </View>
            ))}
            {timeblock.tasks.length > 3 && (
              <Text style={styles.moreText}>
                +{timeblock.tasks.length - 3} more
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 60,
    right: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 8,
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E8E8E8',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: '#888888',
    fontFamily: 'monospace',
  },
  tasksContainer: {
    marginTop: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  taskText: {
    fontSize: 11,
    color: '#B8B8B8',
    fontFamily: 'monospace',
    marginLeft: 6,
    flex: 1,
  },
  moreText: {
    fontSize: 10,
    color: '#666666',
    fontFamily: 'monospace',
    marginTop: 3,
  },
});
