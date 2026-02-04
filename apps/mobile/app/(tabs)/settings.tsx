import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useChronosStore } from '../../store';

export default function SettingsScreen() {
  const router = useRouter();
  const { rolloverTasks, exportData } = useChronosStore();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/(auth)/login');
    }
  };

  const handleRollover = async () => {
    const count = await rolloverTasks();
    Alert.alert('Rollover Complete', `${count || 0} tasks moved to backlog`);
  };

  const handleExport = async () => {
    const data = await exportData();
    if (data) {
      Alert.alert('Export Ready', 'Data exported successfully');
      // In a real app, you'd save this to device storage or share it
    }
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
          Settings
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        {/* Actions */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ 
            color: '#888888', 
            fontSize: 12,
            fontFamily: 'monospace',
            marginBottom: 12
          }}>
            ACTIONS
          </Text>

          <Pressable
            onPress={handleRollover}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1A1A1A',
              borderWidth: 1,
              borderColor: '#333333',
              borderRadius: 4,
              padding: 16,
              marginBottom: 8,
            }}
          >
            <Ionicons name="refresh-outline" size={20} color="#E8E8E8" />
            <Text style={{ 
              color: '#E8E8E8', 
              marginLeft: 12,
              fontFamily: 'monospace'
            }}>
              Rollover Tasks
            </Text>
          </Pressable>

          <Pressable
            onPress={handleExport}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1A1A1A',
              borderWidth: 1,
              borderColor: '#333333',
              borderRadius: 4,
              padding: 16,
            }}
          >
            <Ionicons name="download-outline" size={20} color="#E8E8E8" />
            <Text style={{ 
              color: '#E8E8E8', 
              marginLeft: 12,
              fontFamily: 'monospace'
            }}>
              Export Data
            </Text>
          </Pressable>
        </View>

        {/* Account */}
        <View>
          <Text style={{ 
            color: '#888888', 
            fontSize: 12,
            fontFamily: 'monospace',
            marginBottom: 12
          }}>
            ACCOUNT
          </Text>

          <Pressable
            onPress={handleLogout}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1A1A1A',
              borderWidth: 1,
              borderColor: '#333333',
              borderRadius: 4,
              padding: 16,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#E8E8E8" />
            <Text style={{ 
              color: '#E8E8E8', 
              marginLeft: 12,
              fontFamily: 'monospace'
            }}>
              Sign Out
            </Text>
          </Pressable>
        </View>

        {/* Version */}
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ 
            color: '#666666', 
            fontSize: 12,
            fontFamily: 'monospace'
          }}>
            CHRONOS v1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
