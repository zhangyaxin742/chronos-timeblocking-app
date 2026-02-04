import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TIME_GRID } from '@chronos/shared';

interface CurrentTimeIndicatorProps {
  startHour: number;
}

export function CurrentTimeIndicator({ startHour }: CurrentTimeIndicatorProps) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = (hours - startHour) * 60 + minutes;
      const slots = totalMinutes / 15;
      const newPosition = slots * TIME_GRID.SLOT_HEIGHT;
      setPosition(newPosition);
    };

    updatePosition();
    const interval = setInterval(updatePosition, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startHour]);

  if (position < 0) return null;

  return (
    <View style={[styles.container, { top: position }]} pointerEvents="none">
      <View style={styles.dot} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 60,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888888',
    marginLeft: -4,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#888888',
  },
});
