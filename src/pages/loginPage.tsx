import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import RNRestart from 'react-native-restart';
import {firebase} from '@react-native-firebase/messaging';
import storage from '../storage/storage';
import axios from 'axios';
import Config from 'react-native-config';

const window = Dimensions.get('window');
const App = () => {
  const [fToken, setFToken] = useState<string>();
  useEffect(() => {
    messaging()
      .getToken(firebase.app().options.messagingSenderId)
      .then(x => setFToken(x))
      .catch(e => console.log(e));

    firebase.messaging().onMessage(response => {
      console.log(JSON.stringify(response));
      if (Platform.OS !== 'ios') {
        showNotification(response.notification!);
        return;
      }
      PushNotificationIOS.requestPermissions().then(() =>
        showNotification(response.notification!),
      );
    });
  }, []);

  const showNotification = (
    notification: FirebaseMessagingTypes.Notification,
  ) => {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body!,
    });
  };

  const ADRESS = Config.ADRESS;

  const [loggedIn, setloggedIn] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        console.log('userInfoStorage', resp);
        if (resp) {
          const timeElapsed = Date.now().toString();
          await axios
            .patch(`${ADRESS}/users/${resp.idToken}`, {
              lastLogin: timeElapsed,
              notificationToken: fToken,
            })
            .then(resp => {
              console.log('respdate', resp);
            })
            .catch(errors => {
              console.log('errordate', errors);
              navigation.navigate('Home' as never);
            });
        }
      });

    GoogleSignin.configure({
      webClientId:
        '515496165016-cl5voj2dcqnv0g9ucqhmur7dck0bioho.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken, user} = await GoogleSignin.signIn();
      setloggedIn(true);
      const lastLogin = Date.now().toString();

      if (user.id) {
        async function navigateHome() {
          await axios
            .get(`${ADRESS}/users/${user.id}`)
            .then(async item => {
              //await storage.remove({key: 'userInfo'});
              await axios
                .patch(`${ADRESS}/users/${user.id}`, {
                  lastLogin: lastLogin,
                })
                .then(async item => {});
              await storage.save({
                key: 'userInfo',
                data: {
                  accessToken: accessToken,
                  idToken: user.id,
                  user: user,
                  userPhoto: `${user.photo}`,
                  freeCoin: item.data.freeCoin,
                  messageCoin: item.data.messageCoin,
                  packageName: item.data.packageName,
                  notificationToken: fToken,
                },
                expires: null,
              });
              setloggedIn(true);
            })
            .catch(error => {
              async function postUser() {
                await axios
                  .post(`${ADRESS}/users`, {
                    user: `${user.name}`,
                    userId: `${user.id}`,
                    userPhoto: `${user.photo}`,
                    freeCoin: 5,
                    messageCoin: 0,
                    packageName: '',
                    lastLogin: Date.now.toString(),
                    finishDate: '',
                    notificationToken: fToken,
                  })
                  .then(resp => {
                    console.log('resp', resp);
                  })
                  .catch(errors => {
                    console.log('error', errors);
                  });
                await storage.save({
                  key: 'userInfo',
                  data: {
                    accessToken: accessToken,
                    idToken: user.id,
                    user: user,
                    userPhoto: `${user.photo}`,
                    freeCoin: 10,
                    messageCoin: 0,
                    packageName: '',
                    notificationToken: fToken,
                  },
                  expires: null,
                });
              }
              postUser();
            });
          navigation.navigate('Home' as never);
        }
        navigateHome();
      }
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Opss',
        text2: 'Your login process unseccesfull 👋',
      });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        Alert.alert('An error accurated');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topContent}>
          <Toast position="top" bottomOffset={0} type="success" />
          <Image
            source={require('../assets/photos/appIcon.png')}
            style={styles.appIcon}
          />
          <Text style={styles.mainText}>WISDOM TALKS</Text>
          <Text style={styles.altText}>CHAT WITH ICONS</Text>
        </View>
        <View style={styles.bottomContent}>
          <TouchableOpacity style={styles.googleButton} onPress={signIn}>
            <Image
              style={styles.googleIcon}
              source={require('../assets/photos/google.png')}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleButton} onPress={signIn}>
            <Image
              style={styles.appleIcon}
              source={require('../assets/photos/appleIcon.png')}
            />
            <Text style={styles.googleButtonText}>Sign in with Apple     </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'black',
    flex: 1,
  },
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
  },
  appIcon: {
    width: 90,
    height: 90,
  },
  topContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 34,
    color: 'white',
    fontFamily: 'ShareTechMono-Regular',
  },
  altText: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'ShareTechMono-Regular',
  },
  googleButton: {
    marginTop: 10,
    backgroundColor: '#BB86FC',
    borderRadius: 28,
    width: window.width / 1.4,
    height: window.height / 15,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButtonText: {
    marginLeft: 0,
    fontSize: 18,
    fontWeight: '600',
  },
  googleIcon: {
    height: 24,
    width: 24,
    marginRight: 0,
  },
  appleIcon: {
    height: 50,
    width: 50,
    marginRight: 0,
  },
  animation: {
    width: window.width / 20,
    height: window.height / 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;
