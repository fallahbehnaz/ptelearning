import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import SectionSelectScreen from './screens/SectionSelectScreen';
import HomeScreen from './screens/HomeScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import QuizScreen from './screens/QuizScreen';
import NumbersHomeScreen from './screens/NumbersHomeScreen';
import NumberChoiceScreen from './screens/NumberChoiceScreen';
import NumberTypingScreen from './screens/NumberTypingScreen';
import NumberSpeakingScreen from './screens/NumberSpeakingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SectionSelect" component={SectionSelectScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Flashcards" component={FlashcardScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="NumbersHome" component={NumbersHomeScreen} />
        <Stack.Screen name="NumberChoice" component={NumberChoiceScreen} />
        <Stack.Screen name="NumberTyping" component={NumberTypingScreen} />
        <Stack.Screen name="NumberSpeaking" component={NumberSpeakingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
