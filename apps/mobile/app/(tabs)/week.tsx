import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChronosStore } from '../../store';
import { addDays, formatDateDisplay, getTodayISO, getWeekDates } from '@chronos/shared';

const { width } = Dimensions.get('window');
const DAY_WIDTH = width * 0.85;

export default function WeekScreen() {
  const { 
    selectedDate, 
    setSelectedDate, 
    timeblocks, 
    fetchTimeblocks,
    isLoading 
  } = useChronosStore();

  const [weekStart, setWeekStart] = useState(getTodayISO());
  const weekDates = getWeekDates(weekStart);

  useEffect(() => {
    // Fetch timeblocks for all days in week
    weekDates.forEach(date => {
      fetchTimeblocks(date);
    });
  }, [weekStart]);

  const handlePrevWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  const getTimeblocksForDate = (date: string) => {
    return timeblocks.filter(tb => tb.date === date);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
      {/* Header */}
      <View style={{ 
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '600', 
            color: '#FAFAFA',
            fontFamily: 'monospace',
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>
            WEEK VIEW
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable onPress={handlePrevWeek}>
              <Ionicons name="chevron-back" size={24} color="#A3A3A3" strokeWidth={1.5} />
            </Pressable>
            <Pressable onPress={handleNextWeek}>
              <Ionicons name="chevron-forward" size={24} color="#A3A3A3" strokeWidth={1.5} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Horizontal scroll of days */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={DAY_WIDTH}
        decelerationRate="fast"
        style={{ flex: 1 }}
      >
        {weekDates.map((date, index) => {
          const dayTimeblocks = getTimeblocksForDate(date);
          const isToday = date === getTodayISO();
          
          return (
            <View 
              key={date} 
              style={{ 
                width: DAY_WIDTH,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              {/* Day header */}
              <Pressable
                onPress={() => handleDayPress(date)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: isToday ? '#262626' : 'transparent',
                  borderWidth: 1,
                  borderColor: isToday ? '#3D3D3D' : '#2A2A2A',
                  borderRadius: 2,
                  marginBottom: 16,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: isToday ? '#FAFAFA' : '#A3A3A3',
                  fontFamily: 'monospace',
                  letterSpacing: 1,
                  textAlign: 'center',
                }}>
                  {formatDateDisplay(date)}
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: '#737373',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  {dayTimeblocks.length} timeblocks
                </Text>
              </Pressable>

              {/* Timeblocks list */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {dayTimeblocks.length === 0 ? (
                  <View style={{
                    alignItems: 'center',
                    paddingVertical: 60,
                  }}>
                    <Ionicons name="calendar-outline" size={48} color="#525252" strokeWidth={1.5} />
                    <Text style={{
                      color: '#737373',
                      fontSize: 14,
                      fontFamily: 'monospace',
                      marginTop: 16,
                    }}>
                      No timeblocks
                    </Text>
                  </View>
                ) : (
                  dayTimeblocks
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((timeblock) => (
                      <View
                        key={timeblock.id}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderWidth: 1,
                          borderColor: '#3D3D3D',
                          borderLeftWidth: 3,
                          borderLeftColor: '#737373',
                          borderRadius: 2,
                          padding: 12,
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '500',
                          color: '#FAFAFA',
                          fontFamily: 'monospace',
                          marginBottom: 4,
                        }}>
                          {timeblock.title}
                        </Text>
                        <Text style={{
                          fontSize: 11,
                          color: '#737373',
                          fontFamily: 'monospace',
                        }}>
                          {timeblock.start_time} - {timeblock.end_time}
                        </Text>
                        {timeblock.category && (
                          <Text style={{
                            fontSize: 9,
                            color: '#525252',
                            fontFamily: 'monospace',
                            letterSpacing: 1,
                            marginTop: 4,
                            textTransform: 'uppercase',
                          }}>
                            {timeblock.category.name}
                          </Text>
                        )}
                      </View>
                    ))
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
