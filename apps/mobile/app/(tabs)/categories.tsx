import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useChronosStore } from '../../store';

const BORDER_PATTERNS = [
  { id: 'solid', label: 'SOLID', style: 'solid' as const, width: 3 },
  { id: 'dashed', label: 'DASHED', style: 'dashed' as const, width: 2 },
  { id: 'dotted', label: 'DOTTED', style: 'dotted' as const, width: 2 },
  { id: 'double', label: 'DOUBLE', style: 'solid' as const, width: 4 },
];

export default function CategoriesScreen() {
  const { categories, createCategory, updateCategory, deleteCategory } = useChronosStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedPattern, setSelectedPattern] = useState(BORDER_PATTERNS[0]);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;

    await createCategory({
      name: newCategoryName.trim(),
      color: '#737373', // Monochrome grey
      description: `Pattern: ${selectedPattern.label}`,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNewCategoryName('');
    setShowCreate(false);
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    Alert.alert(
      'Delete Category',
      `Delete "${categoryName}"? This will not delete associated timeblocks.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCategory(categoryId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
      {/* Header */}
      <View style={{ 
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
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
          CATEGORIES
        </Text>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowCreate(!showCreate);
          }}
          style={{
            width: 36,
            height: 36,
            backgroundColor: showCreate ? '#262626' : 'transparent',
            borderWidth: 1,
            borderColor: showCreate ? '#3D3D3D' : '#2A2A2A',
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons 
            name={showCreate ? 'close' : 'add'} 
            size={20} 
            color="#A3A3A3" 
            strokeWidth={1.5}
          />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Create form */}
        {showCreate && (
          <View style={{
            padding: 16,
            backgroundColor: '#1A1A1A',
            borderBottomWidth: 1,
            borderBottomColor: '#2A2A2A',
          }}>
            <Text style={{
              fontSize: 10,
              color: '#737373',
              fontFamily: 'monospace',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              NEW CATEGORY
            </Text>

            <TextInput
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Category name"
              placeholderTextColor="#525252"
              style={{
                backgroundColor: '#0D0D0D',
                borderWidth: 1,
                borderColor: '#3D3D3D',
                borderRadius: 2,
                padding: 12,
                color: '#FAFAFA',
                fontFamily: 'monospace',
                fontSize: 14,
                marginBottom: 12,
              }}
            />

            <Text style={{
              fontSize: 10,
              color: '#737373',
              fontFamily: 'monospace',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              BORDER PATTERN
            </Text>

            <View style={{
              flexDirection: 'row',
              gap: 8,
              marginBottom: 12,
            }}>
              {BORDER_PATTERNS.map((pattern) => (
                <Pressable
                  key={pattern.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPattern(pattern);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    backgroundColor: selectedPattern.id === pattern.id ? '#262626' : '#0D0D0D',
                    borderWidth: 1,
                    borderColor: selectedPattern.id === pattern.id ? '#3D3D3D' : '#2A2A2A',
                    borderRadius: 2,
                    alignItems: 'center',
                  }}
                >
                  <View style={{
                    width: 24,
                    height: 3,
                    backgroundColor: '#737373',
                    marginBottom: 6,
                  }} />
                  <Text style={{
                    fontSize: 9,
                    color: '#A3A3A3',
                    fontFamily: 'monospace',
                    letterSpacing: 0.5,
                  }}>
                    {pattern.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleCreate}
              disabled={!newCategoryName.trim()}
              style={{
                backgroundColor: newCategoryName.trim() ? '#FAFAFA' : '#262626',
                paddingVertical: 12,
                borderRadius: 2,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: newCategoryName.trim() ? '#0D0D0D' : '#525252',
                fontFamily: 'monospace',
                fontSize: 12,
                fontWeight: '500',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                CREATE
              </Text>
            </Pressable>
          </View>
        )}

        {/* Categories list */}
        <View style={{ padding: 16 }}>
          <Text style={{
            fontSize: 10,
            color: '#737373',
            fontFamily: 'monospace',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            {categories.length} CATEGORIES
          </Text>

          {categories.map((category) => (
            <View
              key={category.id}
              style={{
                backgroundColor: '#1A1A1A',
                borderWidth: 1,
                borderColor: '#3D3D3D',
                borderLeftWidth: 3,
                borderLeftColor: '#737373',
                borderRadius: 2,
                padding: 12,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#FAFAFA',
                  fontFamily: 'monospace',
                  marginBottom: 4,
                }}>
                  {category.name}
                </Text>
                {category.description && (
                  <Text style={{
                    fontSize: 11,
                    color: '#737373',
                    fontFamily: 'monospace',
                  }}>
                    {category.description}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() => handleDelete(category.id, category.name)}
                style={{
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'transparent',
                  borderRadius: 2,
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#737373" strokeWidth={1.5} />
              </Pressable>
            </View>
          ))}

          {categories.length === 0 && (
            <View style={{
              alignItems: 'center',
              paddingVertical: 60,
            }}>
              <Ionicons name="folder-outline" size={48} color="#525252" strokeWidth={1.5} />
              <Text style={{
                color: '#737373',
                fontSize: 14,
                fontFamily: 'monospace',
                marginTop: 16,
              }}>
                No categories yet
              </Text>
              <Text style={{
                color: '#525252',
                fontSize: 12,
                fontFamily: 'monospace',
                marginTop: 8,
              }}>
                Tap + to create one
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
