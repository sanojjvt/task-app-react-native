import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>📋 Task</Text>
      <Text style={styles.subtitle}>Organize suas tarefas com eficiência</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
});