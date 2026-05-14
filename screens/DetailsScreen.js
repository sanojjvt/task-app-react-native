import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function DetailsScreen({ route, tasks, setTasks }) {
  const { taskId } = route.params;

  const task = tasks.find((item) => item.id === taskId);

  function completeTask() {
    const updatedTasks = tasks.map((item) => {
      if (item.id === taskId) {
        return { ...item, completed: true };
      }

      return item;
    });

    setTasks(updatedTasks);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>

      <Text style={styles.description}>
        {task.description}
      </Text>

      <Text style={styles.status}>
        Status: {task.completed ? '✅ Concluída' : '⏳ Pendente'}
      </Text>

      {!task.completed && (
        <TouchableOpacity style={styles.button} onPress={completeTask}>
          <Text style={styles.buttonText}>Marcar como concluída</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});