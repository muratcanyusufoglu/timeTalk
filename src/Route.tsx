// In App.js in a new project
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ChatPage from './pages/chatPage';
import DiscoverPage from './pages/discoverPage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatTimeLine from './pages/chatTimeLine';
import {RevenueCatProvider} from './providers/reveneuCatProvider';
import Profile from './pages/profile';
import Login from './pages/loginPage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ChatStack = createNativeStackNavigator();
const DiscoverStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeRoute = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          height: 80,
          backgroundColor: 'black',
        },
      }}
      initialRouteName="ChatRoute">
      <Tab.Screen
        name="ChatRoute"
        component={ChatRoute}
        options={{
          headerShown: false,
          tabBarLabel: 'Chat',
          tabBarIcon: ({color, size}) => (
            <Icon name="comments" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DiscoverRoute"
        component={DiscoverRoute}
        options={{
          headerShown: false,
          tabBarLabel: 'Discover',
          tabBarIcon: ({color, size}) => (
            <Icon name="archway" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileRoute"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="user-tie" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ChatRoute = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ChatTimeLine"
        component={ChatTimeLine}
        options={{headerShown: false}}
      />
      <ChatStack.Screen
        name="ChatPage"
        component={ChatPage}
        options={{headerShown: false}}
      />
    </ChatStack.Navigator>
  );
};
const DiscoverRoute = () => {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen
        name="DiscoverPage"
        component={DiscoverPage}
        options={{headerShown: false}}
      />
      <DiscoverStack.Screen
        name="ChatTimeLine"
        component={ChatTimeLine}
        options={{headerShown: false}}
      />
      <DiscoverStack.Screen
        name="ChatPage"
        component={ChatPage}
        options={{headerShown: false}}
      />
    </DiscoverStack.Navigator>
  );
};

const Stack = createNativeStackNavigator();
function App() {
  return (
    <RevenueCatProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Purchase"
            component={Profile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeRoute}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RevenueCatProvider>
  );
}
export default App;
