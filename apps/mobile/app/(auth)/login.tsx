import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bg-primary"
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6">
        <View className="mb-12">
          <Text className="text-4xl font-bold text-text-primary font-mono mb-2">
            CHRONOS
          </Text>
          <Text className="text-text-tertiary font-mono">
            Visual Timeblocking
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-text-secondary font-mono text-sm mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#666666"
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-bg-secondary border border-border-default rounded px-4 py-3 text-text-primary font-mono"
            />
          </View>

          <View>
            <Text className="text-text-secondary font-mono text-sm mb-2">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#666666"
              secureTextEntry
              className="bg-bg-secondary border border-border-default rounded px-4 py-3 text-text-primary font-mono"
            />
          </View>

          {error ? (
            <Text className="text-red-500 font-mono text-sm">{error}</Text>
          ) : null}

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="bg-text-primary py-3 rounded items-center active:opacity-80"
          >
            <Text className="text-bg-primary font-mono font-semibold">
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-text-tertiary font-mono text-sm">
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text className="text-text-primary font-mono text-sm underline">
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
