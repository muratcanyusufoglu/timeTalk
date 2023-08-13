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
  useEffect(() => {
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
        if (resp) {
          navigation.navigate('Home' as never);
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
      // const credential = auth.GoogleAuthProvider.credential(
      //   idToken,
      //   accessToken,
      // );
      if (idToken) {
        async function navigateHome() {
          await axios
            .get(`${ADRESS}/users/${user.id}`)
            .then(async item => {
              await storage.save({
                key: 'userInfo',
                data: {
                  accessToken: accessToken,
                  idToken: user.id,
                  user: user,
                  freeCoin: item.data.freeCoin,
                  messageCoin: item.data.messageCoin,
                  packageName: item.data.packageName,
                },
                expires: null,
              });
              setloggedIn(true);
              navigation.navigate('Home' as never);
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
                  })
                  .then(resp => {
                    console.log('resp', resp);
                  })
                  .catch(errors => {
                    console.log('error', errors);
                  });
                storage.save({
                  key: 'userInfo',
                  data: {
                    accessToken: accessToken,
                    idToken: user.id,
                    user: user,
                    freeCoin: 5,
                    messageCoin: 0,
                    packageName: '',
                  },
                  expires: null,
                });
              }
              postUser();
            });
          Toast.show({
            type: 'success',
            text1: 'Hello',
            text2: 'Your login process succesfull 👋',
          });
          //RNRestart.Restart();
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

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setloggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Toast position="bottom" bottomOffset={0} type="success" />
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.topContent}>
          <Text style={styles.mainText}>Login</Text>
          <Text style={styles.altText}>Login or sign up</Text>
        </View>
        <View style={styles.bottomContent}>
          <TouchableOpacity style={styles.googleButton} onPress={signIn}>
            <Image
              style={styles.googleIcon}
              source={require('../assets/photos/google.png')}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f2f2f2',
  },
  container: {
    height: Dimensions.get('window').height,
    backgroundColor: '#ffffff',
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
    fontSize: 54,
    color: 'black',
  },
  altText: {
    fontSize: 20,
    color: 'black',
  },
  googleButton: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 4,
    width: window.width / 1.4,
    height: window.height / 15,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
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
  animation: {
    width: window.width / 20,
    height: window.height / 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;
