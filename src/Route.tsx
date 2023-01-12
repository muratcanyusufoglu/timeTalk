// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from './pages/homePage';
import ChatPage from './pages/chatPage';
import ImagePage from './pages/imageGeneratePage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={ChatPage}
          options={{title: 'Jojo'}}
        />
        <Stack.Screen
          name="Dalle"
          component={ImagePage}
          options={{title: 'Jojo'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
