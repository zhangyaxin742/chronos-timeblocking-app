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

interface MonochromeTimeblockCardProps {
  timeblock: Timeblock;
  onPress: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function MonochromeTimeblockCard({ 
  timeblock, 
  onPress, 
  onDelete,
  onDuplicate 
}: MonochromeTimeblockCardProps) {
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
    if (!category) return { style: 'solid', width: 3 };
    
    // Monochrome: distinguish by border pattern, not color
    const patterns: Record<string, { style: 'solid' | 'dashed' | 'dotted', width: number }> = {
      'Work': { style: 'solid', width: 3 },
      'Personal': { style: 'dashed', width: 2 },
      'Focus': { style: 'solid', width: 4 },
      'Health': { style: 'dotted', width: 2 },
    };
    
    return patterns[category.name] || { style: 'solid', width: 3 };
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
      
      if (Math.abs(event.translationX) > 80) {
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd((event) => {
      runOnJS(resetHaptic)();
      
      if (event.translationX < -100) {
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Warning);
        runOnJS(onDelete)();
      }
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
  const borderPattern = getBorderStyle();

  return (
    <View style={[styles.wrapper, { top, height }]}>
      {/* Left action (delete) - monochrome destructive */}
      <Animated.View style={[styles.leftAction, leftActionStyle]}>
        <Ionicons name="trash-outline" size={18} color="#FAFAFA" strokeWidth={1.5} />
      </Animated.View>

      {/* Right action (duplicate) - monochrome success */}
      <Animated.View style={[styles.rightAction, rightActionStyle]}>
        <Ionicons name="copy-outline" size={18} color="#FAFAFA" strokeWidth={1.5} />
      </Animated.View>

      {/* Card - monochrome with pattern-based category */}
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            styles.container,
            {
              borderLeftWidth: borderPattern.width,
              borderLeftStyle: borderPattern.style as any,
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
            
            {timeblock.category && (
              <Text style={styles.category}>
                {timeblock.category.name.toUpperCase()}
              </Text>
            )}
            
            {/* Tasks */}
            {height >= TIME_GRID.SLOT_HEIGHT * 3 && timeblock.tasks && timeblock.tasks.length > 0 && (
              <View style={styles.tasksContainer}>
                {timeblock.tasks.slice(0, 3).map((task: any) => (
                  <View key={task.id} style={styles.taskRow}>
                    <View style={[styles.taskCheckbox, task.is_completed && styles.taskCheckboxCompleted]}>
                      {task.is_completed && (
                        <Text style={styles.taskCheckmark}>✓</Text>
                      )}
                    </View>
                    <Text 
                      style={[
                        styles.taskText,
                        task.is_completed && styles.taskTextCompleted
                      ]} 
                      numberOfLines={1}
                    >
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
    backgroundColor: '#737373', // destructive grey
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  rightAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: '#525252', // success grey
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: '#3D3D3D',
    borderLeftColor: '#737373',
    borderRadius: 2,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FAFAFA',
    fontFamily: 'monospace',
    marginBottom: 2,
    letterSpacing: 0,
  },
  time: {
    fontSize: 10,
    color: '#737373',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  category: {
    fontSize: 9,
    color: '#525252',
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginTop: 2,
  },
  tasksContainer: {
    marginTop: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  taskCheckbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#525252',
    borderRadius: 2,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxCompleted: {
    backgroundColor: '#737373',
    borderColor: '#737373',
  },
  taskCheckmark: {
    fontSize: 9,
    color: '#0D0D0D',
  },
  taskText: {
    fontSize: 11,
    color: '#A3A3A3',
    fontFamily: 'monospace',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#525252',
  },
  moreText: {
    fontSize: 10,
    color: '#525252',
    fontFamily: 'monospace',
    marginTop: 3,
  },
});
