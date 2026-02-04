import { View, Text, StyleSheet } from 'react-native';
import { TIME_GRID } from '@chronos/shared';

interface TimeGridProps {
  startHour?: number;
  endHour?: number;
}

export function TimeGrid({ startHour = 0, endHour = 23 }: TimeGridProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const slotHeight = TIME_GRID.SLOT_HEIGHT;

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  return (
    <View style={styles.container}>
      {hours.map((hour) => (
        <View key={hour} style={[styles.hourRow, { height: slotHeight * TIME_GRID.SLOTS_PER_HOUR }]}>
          {/* Hour label */}
          <View style={styles.labelContainer}>
            <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
          </View>

          {/* Grid lines */}
          <View style={styles.gridContainer}>
            {/* Main hour line */}
            <View style={styles.hourLine} />
            
            {/* Quarter-hour lines */}
            {Array.from({ length: TIME_GRID.SLOTS_PER_HOUR - 1 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.slotLine,
                  { top: (i + 1) * slotHeight }
                ]}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  hourRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  labelContainer: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 4,
  },
  hourLabel: {
    fontSize: 11,
    color: '#888888',
    fontFamily: 'monospace',
    textTransform: 'lowercase',
  },
  gridContainer: {
    flex: 1,
    position: 'relative',
  },
  hourLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#333333',
  },
  slotLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#262626',
  },
});
