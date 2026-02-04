import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  Easing
} from 'react-native-reanimated';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function LoadingSkeleton({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: LoadingSkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function TimeblockSkeleton() {
  return (
    <View style={styles.timeblockContainer}>
      <LoadingSkeleton width="60%" height={16} style={{ marginBottom: 8 }} />
      <LoadingSkeleton width="40%" height={12} />
    </View>
  );
}

export function TimeGridSkeleton() {
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: 6 }).map((_, i) => (
        <TimeblockSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#262626',
  },
  timeblockContainer: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  gridContainer: {
    padding: 16,
  },
});
