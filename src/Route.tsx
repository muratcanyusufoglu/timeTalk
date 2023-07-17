// In App.js in a new project
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ChatPage from './pages/chatPage';
import DiscoverPage from './pages/discoverPage';
import Profile from './pages/profile';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatTimeLine from './pages/chatTimeLine';

const ChatStack = createNativeStackNavigator();
const DiscoverStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const HomeRoute = () => {
  return (
    <Tab.Navigator initialRouteName="ChatRoute">
      <Tab.Screen name="ChatRoute" component={ChatRoute} />
      <Tab.Screen name="DiscoverRoute" component={DiscoverRoute} />
      <Tab.Screen name="ProfileRoute" component={Profile} />
    </Tab.Navigator>
  );
};

const ChatRoute = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="ChatTimeLine" component={ChatTimeLine} />
      <ChatStack.Screen name="ChatPage" component={ChatPage} />
    </ChatStack.Navigator>
  );
};
const DiscoverRoute = () => {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen name="DiscoverPage" component={DiscoverPage} />
      <DiscoverStack.Screen name="ChatTimeLine" component={ChatTimeLine} />
      <DiscoverStack.Screen name="ChatPage" component={ChatPage} />
    </DiscoverStack.Navigator>
  );
};

const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeRoute} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
