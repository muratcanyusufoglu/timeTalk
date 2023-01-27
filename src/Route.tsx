// In App.js in a new project
import React, {useEffect} from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
  getCurrentRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from './pages/homePage';
import ChatPage from './pages/chatPage';
import DallePage from './pages/imageGeneratePage';
import DiscoverPage from './pages/discoverPage';
import LoginPage from './pages/loginPage';
import Profile from './pages/profile';
import {BottomNavigation, Text} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {AsyncStorage} from 'react-native';

let value: any;
const HomeStack = createNativeStackNavigator();

const Homepage = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Login"
        component={LoginPage}
        options={{headerShown: false}}
      />
      {/* <HomeStack.Screen
        name="Home"
        component={HomePage}
        options={{headerShown: false}}
      />
      <HomeStack.Screen name="Chat" component={ChatPage} />
      <HomeStack.Screen
        name="Dalle"
        component={DallePage}
        options={{headerShown: false}}
      /> */}
    </HomeStack.Navigator>
  );
};

const Chatpage = () => <ChatPage />;

const DiscoverRoute = () => <DiscoverPage />;

function App() {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home-outline',
      unfocusedIcon: 'home',
    },
    {
      key: 'chat',
      title: 'Chat',
      focusedIcon: 'forum-outline',
      unfocusedIcon: 'forum',
    },
    {
      key: 'dalle',
      title: 'Dalle',
      focusedIcon: 'message-image-outline',
      unfocusedIcon: 'message-image',
    },
    {
      key: 'discover',
      title: 'Discover',
      focusedIcon: 'image-search-outline',
      unfocusedIcon: 'image-search',
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account-outline',
      unfocusedIcon: 'account',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Homepage,
    discover: DiscoverRoute,
    dalle: DallePage,
    chat: Chatpage,
    profile: Profile,
  });

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomNavigation
          shifting={true}
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={
            value == 'true'
              ? {backgroundColor: 'red', height: 70}
              : {backgroundColor: '#E0ECFF', height: 70}
          }
          activeColor={'#75839D'}
          theme={{colors: {secondaryContainer: 'transparent'}}}
          sceneAnimationEnabled={true}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;
