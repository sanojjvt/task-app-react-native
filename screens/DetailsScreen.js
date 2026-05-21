import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTasks } from '../context/TasksContext';

export default function DetailsScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, removeTask, markDone, updateDescription } = useTasks();

  // Lê sempre a versão mais recente da tarefa do contexto
  const task = tasks.find((t) => t.id === taskId);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const [descValue, setDescValue] = useState(task?.description || '');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleDescChange = useCallback(
    (text) => {
      setDescValue(text);
      updateDescription(taskId, text);
    },
    [taskId, updateDescription]
  );

  const handleComplete = useCallback(() => {
    Alert.alert('Concluir Tarefa', 'Parabéns por completar esta tarefa! 🎉', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => {
          markDone(taskId);
          navigation.goBack();
        },
      },
    ]);
  }, [taskId, markDone, navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert('Remover Tarefa', 'Tem certeza que deseja remover esta tarefa permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          removeTask(taskId);
          navigation.goBack();
        },
      },
    ]);
  }, [taskId, removeTask, navigation]);

  if (!task) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>😭</Text>
          <Text style={styles.errorTitle}>Tarefa não encontrada</Text>
          <Text style={styles.errorText}>Esta tarefa pode ter sido removida.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Status badge */}
          <View style={styles.header}>
            <View style={[styles.statusBadge, task.completed ? styles.statusDoneBg : styles.statusPendingBg]}>
              <Text style={[styles.statusBadgeText, task.completed ? styles.statusDoneText : styles.statusPendingText]}>
                {task.completed ? '✅ Concluída' : '⏳ Em andamento'}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{task.title}</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>CRIADO EM</Text>
              <Text style={styles.metaValue}>{task.createdAt || 'Hoje'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>ID DA TAREFA</Text>
              <Text style={styles.metaValue}>#{task.id.slice(-6).toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>📝 DESCRIÇÃO</Text>
          <View style={styles.descriptionBox}>
            <TextInput
              style={styles.descriptionInput}
              value={descValue}
              onChangeText={handleDescChange}
              placeholder="Adicione detalhes sobre esta tarefa..."
              placeholderTextColor="#444"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Actions */}
          {!task.completed && (
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.85}>
              <Text style={styles.completeButtonText}>✓ Marcar como concluída</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.85}>
            <Text style={styles.deleteButtonText}>🗑️ Remover tarefa</Text>
          </TouchableOpacity>

          {/* Completed banner */}
          {task.completed && (
            <View style={styles.completedBanner}>
              <Text style={styles.completedBannerText}>🎉 Parabéns! Esta tarefa foi concluída!</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  card: {
    backgroundColor: '#1C1C1C', margin: 18, padding: 22,
    borderRadius: 20, borderWidth: 1, borderColor: '#2A2A2A',
  },
  header: { marginBottom: 16 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusBadgeText: { fontSize: 12, fontWeight: '600' },
  statusPendingBg: { backgroundColor: 'rgba(240,160,48,0.12)' },
  statusPendingText: { color: '#F0A030' },
  statusDoneBg: { backgroundColor: 'rgba(61,189,122,0.12)' },
  statusDoneText: { color: '#3DBD7A' },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 18, lineHeight: 32, letterSpacing: -0.3 },
  metaRow: { flexDirection: 'row', gap: 24, marginBottom: 18 },
  metaItem: { flex: 1 },
  metaLabel: { color: '#555', fontSize: 10, letterSpacing: 0.8, marginBottom: 4 },
  metaValue: { color: '#CCCCCC', fontSize: 14, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#252525', marginVertical: 18 },
  sectionLabel: { color: '#555', fontSize: 10, letterSpacing: 0.8, marginBottom: 10 },
  descriptionBox: {
    backgroundColor: '#161616', borderRadius: 12, borderWidth: 1,
    borderColor: '#2A2A2A', padding: 14, marginBottom: 22, minHeight: 100,
  },
  descriptionInput: { color: '#CCCCCC', fontSize: 15, lineHeight: 22, minHeight: 80 },
  completeButton: {
    backgroundColor: '#7C6AF7', padding: 16, borderRadius: 14,
    alignItems: 'center', marginBottom: 10,
    shadowColor: '#7C6AF7', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  completeButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  deleteButton: {
    backgroundColor: '#1E1E1E', padding: 16, borderRadius: 14,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,68,68,0.2)',
  },
  deleteButtonText: { color: '#FF5555', fontSize: 15, fontWeight: '600' },
  completedBanner: {
    marginTop: 16, padding: 14, backgroundColor: 'rgba(61,189,122,0.1)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(61,189,122,0.25)', alignItems: 'center',
  },
  completedBannerText: { color: '#3DBD7A', fontSize: 14, fontWeight: '600' },
  errorCard: {
    backgroundColor: '#1C1C1C', margin: 20, padding: 30,
    borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A',
  },
  errorIcon: { fontSize: 56, marginBottom: 16 },
  errorTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  errorText: { color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  backButton: { backgroundColor: '#7C6AF7', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 12 },
  backButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
