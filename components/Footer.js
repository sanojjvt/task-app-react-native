import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      <View style={styles.divider} />
      
      <View style={styles.content}>
        <Text style={styles.developerText}>
          Desenvolvido com <Text style={styles.heart}>❤️</Text> por Guilherme Luz
        </Text>
        
        <Text style={styles.copyright}>
          © {currentYear} • TaskFlow App
        </Text>
        
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>React Native</Text>
          <Text style={styles.badge}>Versão 2.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
  },
  developerText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  heart: {
    color: '#FF4444',
    fontSize: 14,
  },
  copyright: {
    color: '#666',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  badge: {
    backgroundColor: '#1A1A1A',
    color: '#6C63FF',
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
});