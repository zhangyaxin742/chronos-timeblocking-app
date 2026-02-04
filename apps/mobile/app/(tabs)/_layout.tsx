import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FAFAFA',
        tabBarInactiveTintColor: '#737373',
        tabBarStyle: {
          backgroundColor: '#0D0D0D',
          borderTopColor: '#2A2A2A',
          borderTopWidth: 1,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'monospace',
          fontSize: 10,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={18} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          title: 'Week',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={18} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="backlog"
        options={{
          title: 'Backlog',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={18} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-outline" size={18} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={18} color={color} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
