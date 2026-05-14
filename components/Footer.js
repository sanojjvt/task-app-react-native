import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>Desenvolvido em React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    color: '#555',
  },
});