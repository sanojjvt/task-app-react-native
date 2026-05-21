import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

import { TasksProvider } from './context/TasksContext';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TasksProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#161616' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600' },
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#0D0D0D' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Detalhes"
            component={DetailsScreen}
            options={{
              title: 'Detalhes da Tarefa',
              headerBackTitle: 'Voltar',
              headerStyle: { backgroundColor: '#161616' },
              headerTintColor: '#7C6AF7',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}