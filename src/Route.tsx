// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from './pages/homePage';
import ChatPage from './pages/chatPage';
import ImagePage from './pages/imageGeneratePage';
import {BottomNavigation, Text} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const Homepage = () => <HomePage />;

const Chatpage = () => <ChatPage />;

const RecentsRoute = () => <ChatPage />;

const NotificationsRoute = () => <ChatPage />;

function App() {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    {key: 'chat', title: 'Chat', focusedIcon: 'album'},
    {key: 'likes', title: 'Likes', focusedIcon: 'history'},
    {
      key: 'discover',
      title: 'Discover',
      focusedIcon: 'bell',
      unfocusedIcon: 'bell-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Homepage,
    chat: Chatpage,
    likes: RecentsRoute,
    discover: NotificationsRoute,
  });

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomNavigation
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
