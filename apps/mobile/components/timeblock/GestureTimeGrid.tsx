import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { TIME_GRID } from '@chronos/shared';
import { TimeGrid } from './TimeGrid';

interface GestureTimeGridProps {
  startHour?: number;
  endHour?: number;
  onLongPress: (time: string) => void;
}

export function GestureTimeGrid({ 
  startHour = 0, 
  endHour = 23,
  onLongPress 
}: GestureTimeGridProps) {
  const [previewPosition, setPreviewPosition] = useState<number | null>(null);

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart((event) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Calculate time from Y position
      const y = event.y;
      const totalMinutes = (y / TIME_GRID.SLOT_HEIGHT) * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor((totalMinutes % 60) / 15) * 15; // Round to 15min
      
      if (hours >= startHour && hours <= endHour) {
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        setPreviewPosition(y);
        onLongPress(timeString);
      }
    })
    .onFinalize(() => {
      setPreviewPosition(null);
    });

  return (
    <GestureDetector gesture={longPressGesture}>
      <View style={styles.container}>
        <TimeGrid startHour={startHour} endHour={endHour} />
        
        {/* Preview indicator */}
        {previewPosition !== null && (
          <View 
            style={[
              styles.preview,
              { top: Math.floor(previewPosition / TIME_GRID.SLOT_HEIGHT) * TIME_GRID.SLOT_HEIGHT }
            ]} 
          />
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  preview: {
    position: 'absolute',
    left: 60,
    right: 16,
    height: TIME_GRID.SLOT_HEIGHT * 4, // 1 hour default
    marginLeft: 12,
    backgroundColor: 'rgba(232, 232, 232, 0.1)',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    borderRadius: 4,
    pointerEvents: 'none',
  },
});
