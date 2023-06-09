// In App.js in a new project
import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from './pages/homePage';
import ChatPage from './pages/chatPage';
import DallePage from './pages/imageGeneratePage';
import DiscoverPage from './pages/discoverPage';
import LoginPage from './pages/loginPage';
import Profile from './pages/profile';
import TimePage from './pages/timePage';
import {BottomNavigation} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import store from '../src/redux/store';
import storage from './storage/storage';

const window = Dimensions.get('window');

const HomeStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Homepage = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Discover"
        component={DiscoverPage}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Home"
        component={Chatpage}
        options={{headerShown: false}}
      />
      <HomeStack.Screen name="Chat" component={ChatPage} />
      <HomeStack.Screen
        name="Dalle"
        component={DallePage}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Login"
        component={LoginPage}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Time"
        component={TimePage}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

const Chatpage = () => <HomePage />;

const DiscoverRoute = () => <DiscoverPage />;

function App() {
  const [userInfo, setUserInfo] = React.useState();
  useEffect(() => {
    storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        setUserInfo(resp.token);
        console.log('respa', resp.token, userInfo);
        if (!resp.token) {
          setUserInfo(false);
        }
      });
  }, []);
  const [index, setIndex] = React.useState(0);
  const [routesSignIn, setRoutesSignIn] = React.useState([
    {
      key: 'login',
      title: 'Login',
      focusedIcon: 'home-outline',
      unfocusedIcon: 'home',
    },
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home-outline',
      unfocusedIcon: 'home',
    },
    {
      key: 'discover',
      title: 'Discover',
      focusedIcon: 'image-search-outline',
      unfocusedIcon: 'image-search',
    },

    {
      key: 'chat',
      title: 'Chat',
      focusedIcon: 'forum-outline',
      unfocusedIcon: 'forum',
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account-outline',
      unfocusedIcon: 'account',
    },
  ]);

  const [routes, setRoutes] = React.useState([
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
    chat: Homepage,
    profile: Profile,
    login: LoginPage,
  });

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <BottomNavigation
            shifting={true}
            navigationState={{
              index,
              routes: userInfo == undefined ? routesSignIn : routes,
            }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={
              userInfo == undefined
                ? {height: 0}
                : {backgroundColor: '#000000', height: window.height / 11}
            }
            activeColor={'#75839D'}
            theme={{colors: {secondaryContainer: 'transparent'}}}
            sceneAnimationEnabled={true}
          />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
export default App;
