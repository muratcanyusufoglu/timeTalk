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
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {onUpdateLogin} from '../redux/action/index';
import RNRestart from 'react-native-restart';
import storage from '../storage/storage';
import Lottie from 'lottie-react-native';
import axios from 'axios';
import Config from 'react-native-config';

// const TaskSchema = {
//   name: 'Task',
//   login: true,
//   properties: {
//     _id: 'int',
//     name: 'string',
//     status: 'string?',
//     owner_id: 'string?',
//   },
//   primaryKey: '_id',
// };

const window = Dimensions.get('window');
const App = () => {
  const ADRESS = Config.ADRESS;

  const [loggedIn, setloggedIn] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '101181523513-2halvkj3k0a6j8fqpvbf92002b5dequk.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
  }, []);

  // const realm = Realm.open({
  //   path: 'realm-files/myrealm',
  //   schema: [TaskSchema],
  // });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken, user} = await GoogleSignin.signIn();
      //console.log('auth', user.id, user.name, await GoogleSignin.signIn());
      setloggedIn(true);
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await auth().signInWithCredential(credential);
      if (idToken) {
        async function navigateHome() {
          await axios
            .get(`${ADRESS}/users/${user.id}`)
            .then(item => {
              console.log('itemlogin', item);
              storage.save({
                key: 'userInfo',
                data: {
                  //token: Platform.OS === 'ios' ? apnToken : fcmToken,
                  accessToken: accessToken,
                  idToken: user.id,
                  user: user,
                  gptToken: item.data.gptToken,
                  freeToken: item.data.freeToken,
                  dalleToken: item.data.dalleToken,
                },
                expires: null,
              });
            })
            .catch(error => {
              console.log('errorlogin', error);
              async function postUser() {
                await axios
                  .post(`${ADRESS}/users`, {
                    user: `${user.name}`,
                    userId: `${user.id}`,
                    userPhoto: `${user.photo}`,
                    gptToken: 0,
                    dalleToken: 0,
                    freeToken: 25,
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
                    //token: Platform.OS === 'ios' ? apnToken : fcmToken,
                    accessToken: accessToken,
                    idToken: user.id,
                    user: user,
                    gptToken: 0,
                    freeToken: 25,
                    dalleToken: 0,
                  },
                  expires: null,
                });
              }
              postUser();
            });
          // dispatch(
          //   onUpdateLogin({
          //     accessToken: accessToken,
          //     idToken: idToken,
          //     user: user,
          //   }),
          // );
          Toast.show({
            type: 'success',
            text1: 'Hello',
            text2: 'Your login process succesfull 👋',
          });
          RNRestart.Restart();

          //navigation.navigate('Home' as never);
        }
        navigateHome();
      }
    } catch (error) {
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
          <TouchableOpacity style={styles.googleButton} onPress={signOut}>
            <Image
              style={styles.googleIcon}
              source={require('../assets/photos/google.png')}
            />
            <Text style={styles.googleButtonText}>Sign Out</Text>
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
