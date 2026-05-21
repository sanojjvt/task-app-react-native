import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTasks } from '../context/TasksContext';

function TaskItem({ item, onToggle, onDelete, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  function handleDelete() {
    Alert.alert('Remover Tarefa', 'Tem certeza que deseja remover esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(
            () => onDelete(item.id)
          );
        },
      },
    ]);
  }

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.taskCard, item.completed && styles.taskCardCompleted]}
        onPress={() => onPress(item.id)}
        activeOpacity={0.75}
      >
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggle(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
            {item.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text
            style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <View style={styles.taskMeta}>
            <Text style={styles.taskDate}>📅 {item.createdAt}</Text>
            <View style={[styles.statusBadge, item.completed ? styles.statusDoneBg : styles.statusPendingBg]}>
              <Text style={[styles.statusBadgeText, item.completed ? styles.statusDoneText : styles.statusPendingText]}>
                {item.completed ? 'Concluída' : 'Pendente'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const { tasks, addTask, removeTask, toggleComplete } = useTasks();
  const [taskName, setTaskName] = useState('');
  const [filter, setFilter] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAdd = useCallback(() => {
    if (!taskName.trim()) {
      Alert.alert('Atenção', 'Por favor, digite o nome da tarefa!');
      return;
    }
    addTask(taskName);
    setTaskName('');
  }, [taskName, addTask]);

  const filteredTasks = (() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  })();

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  const renderItem = ({ item }) => (
    <TaskItem
      item={item}
      onToggle={toggleComplete}
      onDelete={removeTask}
      onPress={(id) => navigation.navigate('Detalhes', { taskId: id })}
    />
  );

  const FILTERS = [
    { key: 'all', label: 'Todas' },
    { key: 'active', label: 'Pendentes' },
    { key: 'completed', label: 'Concluídas' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.headerTitle}>📋 Minhas Tarefas</Text>
          <Text style={styles.headerSubtitle}>Organize seu dia com eficiência</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.statDone]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.statPending]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
        </Animated.View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterButton, filter === f.key && styles.filterButtonActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="O que você precisa fazer?"
            placeholderTextColor="#555"
            value={taskName}
            onChangeText={setTaskName}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.8}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* List or empty */}
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>
              {filter === 'all' ? 'Nenhuma tarefa ainda' : filter === 'active' ? 'Nenhuma tarefa pendente' : 'Nenhuma tarefa concluída'}
            </Text>
            <Text style={styles.emptyText}>
              {filter === 'all' ? 'Adicione sua primeira tarefa acima!' : 'Troque o filtro para ver outras tarefas.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerDev}>Desenvolvido com ❤️ por Guilherme Luz</Text>
          <Text style={styles.footerCopy}>© {new Date().getFullYear()} • TaskFlow App</Text>
          <View style={styles.badgeRow}>
            <Text style={styles.footerBadge}>React Native</Text>
            <Text style={styles.footerBadge}>Versão 2.0</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  headerSubtitle: { color: '#666', fontSize: 14, marginTop: 4 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 22, gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#1C1C1C', paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A',
  },
  statNumber: { color: '#7C6AF7', fontSize: 22, fontWeight: '700' },
  statDone: { color: '#3DBD7A' },
  statPending: { color: '#F0A030' },
  statLabel: { color: '#666', fontSize: 11, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 22, gap: 8, marginBottom: 18 },
  filterButton: {
    flex: 1, paddingVertical: 9, borderRadius: 20,
    backgroundColor: '#1C1C1C', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A',
  },
  filterButtonActive: { backgroundColor: '#7C6AF7', borderColor: '#7C6AF7' },
  filterText: { color: '#777', fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 22, marginBottom: 20, gap: 10 },
  input: {
    flex: 1, backgroundColor: '#1C1C1C', color: '#FFFFFF',
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#2A2A2A', fontSize: 15,
  },
  addButton: {
    width: 52, height: 52, backgroundColor: '#7C6AF7', borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#7C6AF7', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  addButtonText: { color: '#FFFFFF', fontSize: 28, fontWeight: '400', marginTop: -2 },
  listContainer: { paddingHorizontal: 22, paddingBottom: 10 },
  taskCard: {
    backgroundColor: '#1C1C1C', padding: 14, borderRadius: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A',
  },
  taskCardCompleted: { opacity: 0.6, backgroundColor: '#161616' },
  checkboxContainer: { marginRight: 12 },
  checkbox: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#7C6AF7',
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',
  },
  checkboxChecked: { backgroundColor: '#7C6AF7', borderColor: '#7C6AF7' },
  checkmark: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  taskContent: { flex: 1 },
  taskTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '500', marginBottom: 5 },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#666' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskDate: { color: '#555', fontSize: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusBadgeText: { fontSize: 10, fontWeight: '600' },
  statusPendingBg: { backgroundColor: 'rgba(240,160,48,0.12)' },
  statusPendingText: { color: '#F0A030' },
  statusDoneBg: { backgroundColor: 'rgba(61,189,122,0.12)' },
  statusDoneText: { color: '#3DBD7A' },
  deleteButton: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(255,68,68,0.1)', justifyContent: 'center',
    alignItems: 'center', marginLeft: 8,
  },
  deleteButtonText: { fontSize: 18 },
  emptyState: { alignItems: 'center', paddingHorizontal: 40, paddingVertical: 50 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptyText: { color: '#555', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  footer: { paddingHorizontal: 22, paddingVertical: 20, marginTop: 10, alignItems: 'center' },
  footerDivider: { width: '100%', height: 1, backgroundColor: '#1E1E1E', marginBottom: 16 },
  footerDev: { color: '#555', fontSize: 13, marginBottom: 4 },
  footerCopy: { color: '#444', fontSize: 11, marginBottom: 10 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  footerBadge: {
    backgroundColor: '#1C1C1C', color: '#7C6AF7', fontSize: 10,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A2A',
  },
});