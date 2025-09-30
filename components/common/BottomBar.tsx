import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (p: string) => pathname === p;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} activeOpacity={0.8} onPress={() => router.replace('/(main)/home')}>
        <Ionicons name={isActive('/(main)/home') ? 'home' : 'home-outline'} size={22} color={isActive('/(main)/home') ? '#111827' : '#9ca3af'} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} activeOpacity={0.8} onPress={() => router.replace('/(main)/categories')}>
        <Ionicons name={isActive('/(main)/categories') ? 'grid' : 'grid-outline'} size={22} color={isActive('/(main)/categories') ? '#111827' : '#9ca3af'} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} activeOpacity={0.8} onPress={() => router.replace('/(main)/profile')}>
        <Ionicons name={isActive('/(main)/profile') ? 'person' : 'person-outline'} size={22} color={isActive('/(main)/profile') ? '#111827' : '#9ca3af'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


