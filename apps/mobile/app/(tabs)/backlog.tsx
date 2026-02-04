import { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChronosStore } from '../../store';

export default function BacklogScreen() {
  const { 
    backlogTasks, 
    fetchBacklogTasks, 
    toggleTaskComplete,
    isLoading 
  } = useChronosStore();

  useEffect(() => {
    fetchBacklogTasks();
  }, []);

  const onRefresh = () => {
    fetchBacklogTasks();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
      {/* Header */}
      <View style={{ 
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
          Backlog
        </Text>
        <Text style={{ 
          fontSize: 12, 
          color: '#888888',
          fontFamily: 'monospace',
          marginTop: 4
        }}>
          {backlogTasks.length} unscheduled tasks
        </Text>
      </View>

      {/* Tasks List */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <View style={{ padding: 16 }}>
          {backlogTasks.length === 0 ? (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              paddingVertical: 60
            }}>
              <Ionicons name="checkmark-circle-outline" size={48} color="#666666" />
              <Text style={{ 
                color: '#888888', 
                marginTop: 16,
                fontFamily: 'monospace'
              }}>
                No tasks in backlog
              </Text>
            </View>
          ) : (
            backlogTasks.map((task) => (
              <Pressable
                key={task.id}
                onPress={() => toggleTaskComplete(task.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333333',
                  borderRadius: 4,
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: '#666666',
                    marginRight: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {task.is_completed && (
                    <Ionicons name="checkmark" size={16} color="#E8E8E8" />
                  )}
                </View>
                <Text
                  style={{
                    flex: 1,
                    color: task.is_completed ? '#666666' : '#E8E8E8',
                    fontFamily: 'monospace',
                    textDecorationLine: task.is_completed ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
