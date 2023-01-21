// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from './pages/homePage';
import ChatPage from './pages/chatPage';
import DallePage from './pages/imageGeneratePage';
import DiscoverPage from './pages/discoverPage';
import LoginPage from './pages/loginPage';
import Profile from './pages/profile';
import {BottomNavigation, Text} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const Homepage = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomePage}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Login"
        component={LoginPage}
        options={{headerShown: false}}
      />
      <HomeStack.Screen name="Chat" component={ChatPage} />
      <HomeStack.Screen
        name="Dalle"
        component={DallePage}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

const Chatpage = () => <ChatPage />;

const RecentsRoute = () => <ChatPage />;

const DiscoverRoute = () => <DiscoverPage />;

function App() {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home',
    },
    {key: 'chat', title: 'Chat', focusedIcon: 'forum'},
    {
      key: 'dalle',
      title: 'Dalle',
      focusedIcon: 'message-image',
    },
    {
      key: 'discover',
      title: 'Discover',
      focusedIcon: 'bell',
      unfocusedIcon: 'sunglasses',
    },
    {key: 'profile', title: 'Profile', focusedIcon: 'account'},
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
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{backgroundColor: '#E0ECFF', height: 70}}
          activeColor={'#75839D'}
          sceneAnimationEnabled={true}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
