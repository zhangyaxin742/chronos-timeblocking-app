import { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { Timeblock } from '@chronos/shared';
import { TIME_GRID } from '@chronos/shared';

interface SwipeableTimeblockCardProps {
  timeblock: Timeblock;
  onPress: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function SwipeableTimeblockCard({ 
  timeblock, 
  onPress, 
  onDelete,
  onDuplicate 
}: SwipeableTimeblockCardProps) {
  const translateX = useSharedValue(0);
  const hasTriggeredHaptic = useRef(false);

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

  const triggerHaptic = () => {
    if (!hasTriggeredHaptic.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      hasTriggeredHaptic.current = true;
    }
  };

  const resetHaptic = () => {
    hasTriggeredHaptic.current = false;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      
      // Trigger haptic at threshold
      if (Math.abs(event.translationX) > 80) {
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd((event) => {
      runOnJS(resetHaptic)();
      
      // Swipe left to delete
      if (event.translationX < -100) {
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Warning);
        runOnJS(onDelete)();
      }
      // Swipe right to duplicate
      else if (event.translationX > 100) {
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
        runOnJS(onDuplicate)();
      }
      
      translateX.value = withSpring(0);
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onPress)();
    });

  const composed = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? Math.min(-translateX.value / 100, 1) : 0,
  }));

  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? Math.min(translateX.value / 100, 1) : 0,
  }));

  const top = calculatePosition();
  const height = calculateHeight();
  const borderStyle = getBorderStyle();

  return (
    <View style={[styles.wrapper, { top, height }]}>
      {/* Left action (delete) */}
      <Animated.View style={[styles.leftAction, leftActionStyle]}>
        <Ionicons name="trash-outline" size={20} color="#E8E8E8" />
      </Animated.View>

      {/* Right action (duplicate) */}
      <Animated.View style={[styles.rightAction, rightActionStyle]}>
        <Ionicons name="copy-outline" size={20} color="#E8E8E8" />
      </Animated.View>

      {/* Card */}
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            styles.container,
            {
              borderStyle: borderStyle as any,
            },
            animatedStyle
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
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 60,
    right: 16,
    marginLeft: 12,
  },
  leftAction: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  rightAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: '#1A4D2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  container: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 8,
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
