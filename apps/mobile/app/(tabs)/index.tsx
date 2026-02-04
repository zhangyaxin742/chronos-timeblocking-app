import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useChronosStore } from '../../store';
import { addDays, formatDateDisplay, getTodayISO, TIME_GRID } from '@chronos/shared';
import { GestureTimeGrid } from '../../components/timeblock/GestureTimeGrid';
import { CurrentTimeIndicator } from '../../components/timeblock/CurrentTimeIndicator';
import { SwipeableTimeblockCard } from '../../components/timeblock/SwipeableTimeblockCard';
import { CreateTimeblockModal } from '../../components/timeblock/CreateTimeblockModal';
import { TimeblockDetailModal } from '../../components/timeblock/TimeblockDetailModal';
import type { Timeblock } from '@chronos/shared';

export default function TodayScreen() {
  const { 
    selectedDate, 
    setSelectedDate, 
    timeblocks, 
    fetchTimeblocks, 
    fetchCategories,
    isLoading 
  } = useChronosStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTimeblock, setSelectedTimeblock] = useState<Timeblock | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchCategories();
    fetchTimeblocks(selectedDate);
  }, []);

  useEffect(() => {
    // Scroll to first timeblock or 8am
    if (scrollViewRef.current && timeblocks.length > 0) {
      const sorted = [...timeblocks].sort((a, b) => a.start_time.localeCompare(b.start_time));
      const firstTime = sorted[0]?.start_time || '08:00';
      const [hours, minutes] = firstTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const scrollTo = Math.max(0, (totalMinutes / 15) * TIME_GRID.SLOT_HEIGHT - 120);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: scrollTo, animated: false });
      }, 100);
    }
  }, [timeblocks]);

  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(getTodayISO());
  };

  const onRefresh = () => {
    fetchTimeblocks(selectedDate);
  };

  const handleTimeblockPress = (timeblock: Timeblock) => {
    setSelectedTimeblock(timeblock);
  };

  const handleCreatePress = () => {
    setShowCreateModal(true);
  };

  const handleLongPress = (time: string) => {
    setShowCreateModal(true);
  };

  const handleDeleteTimeblock = (timeblock: Timeblock) => {
    Alert.alert(
      'Delete Timeblock',
      `Delete "${timeblock.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await useChronosStore.getState().deleteTimeblock(timeblock.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleDuplicateTimeblock = async (timeblock: Timeblock) => {
    const tomorrow = addDays(selectedDate, 1);
    await useChronosStore.getState().duplicateTimeblock(
      timeblock.id,
      tomorrow,
      timeblock.start_time,
      true
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#262626'
      }}>
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: '#E8E8E8',
          fontFamily: 'monospace'
        }}>
          CHRONOS
        </Text>
      </View>

      {/* Date Navigation */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#262626'
      }}>
        <Pressable onPress={handlePrevDay}>
          <Ionicons name="chevron-back" size={24} color="#E8E8E8" />
        </Pressable>

        <Pressable onPress={handleToday}>
          <Text style={{ 
            fontSize: 16, 
            color: '#E8E8E8',
            fontFamily: 'monospace'
          }}>
            {formatDateDisplay(selectedDate)}
          </Text>
        </Pressable>

        <Pressable onPress={handleNextDay}>
          <Ionicons name="chevron-forward" size={24} color="#E8E8E8" />
        </Pressable>
      </View>

      {/* Timeline with TimeGrid */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <View style={{ position: 'relative', minHeight: TIME_GRID.SLOT_HEIGHT * TIME_GRID.SLOTS_PER_HOUR * 24 }}>
          <GestureTimeGrid 
            startHour={0} 
            endHour={23}
            onLongPress={handleLongPress}
          />
          <CurrentTimeIndicator startHour={0} />
          
          {/* Render timeblocks */}
          {timeblocks.map((timeblock) => (
            <SwipeableTimeblockCard
              key={timeblock.id}
              timeblock={timeblock}
              onPress={() => handleTimeblockPress(timeblock)}
              onDelete={() => handleDeleteTimeblock(timeblock)}
              onDuplicate={() => handleDuplicateTimeblock(timeblock)}
            />
          ))}

          {/* Empty state */}
          {timeblocks.length === 0 && (
            <View style={{ 
              position: 'absolute',
              top: 240,
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60
            }}>
              <Ionicons name="calendar-outline" size={48} color="#666666" />
              <Text style={{ 
                color: '#888888', 
                marginTop: 16,
                fontFamily: 'monospace'
              }}>
                No timeblocks for this day
              </Text>
              <Text style={{ 
                color: '#666666', 
                marginTop: 8,
                fontFamily: 'monospace',
                fontSize: 12
              }}>
                Tap + to create one
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={handleCreatePress}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: 4,
          backgroundColor: '#E8E8E8',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Ionicons name="add" size={28} color="#0D0D0D" />
      </Pressable>

      {/* Modals */}
      <CreateTimeblockModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialDate={selectedDate}
      />
      
      <TimeblockDetailModal
        visible={selectedTimeblock !== null}
        onClose={() => setSelectedTimeblock(null)}
        timeblock={selectedTimeblock}
      />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
