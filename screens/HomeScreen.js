import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HomeScreen({ navigation, tasks, setTasks }) {
  const [taskName, setTaskName] = useState('');

  function addTask() {
    if (taskName.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: taskName,
      completed: false,
      description: 'Tarefa criada pelo usuário',
    };

    setTasks([...tasks, newTask]);
    setTaskName('');
  }

  return (
    <View style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Lista de Tarefas</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite uma tarefa"
        value={taskName}
        onChangeText={setTaskName}
      />

      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() =>
              navigation.navigate('Detalhes', {
                taskId: item.id,
              })
            }
          >
            <Text style={styles.taskText}>{item.title}</Text>

            <Text>
              {item.completed ? '✅ Concluída' : '⏳ Pendente'}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  taskText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});