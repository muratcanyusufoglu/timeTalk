/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {SegmentedButtons} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import storage from '../storage/storage';
import RNRestart from 'react-native-restart';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import Config from 'react-native-config';

const window = Dimensions.get('window');

const App = () => {
  const [value, setValue] = React.useState('');
  const userInfo = useSelector((store: any) => store.userReducer.userInfo);
  const ADRESS = Config.ADRESS;

  const navigation = useNavigation();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '101181523513-2halvkj3k0a6j8fqpvbf92002b5dequk.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });

    storage
      .load({
        key: 'userInfo',
      })
      .then(async resp => {
        console.log('respaaahome', resp);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Toast position="bottom" bottomOffset={0} type="success" />
      <View style={styles.coinHeader}>
        <View>
          <Text>Logo</Text>
        </View>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Text style={{color: '#000A1A'}}>Token</Text>
          <Icon name="money" size={18} style={{color: '#75839D'}} />
        </View>
      </View>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        style={styles.segmentedButtons}
        buttons={[
          {
            value: 'chats',
            label: 'Chats',
            onPress: () => navigation.navigate('Chat' as never),
            style: {
              borderRadius: 6,
            },
          },
          {
            value: 'dalle',
            label: 'Dalle',
            onPress: () => navigation.navigate('Chat' as never),
            style: {
              borderRadius: 6,
            },
          },
          {
            value: 'all',
            label: 'All',
            onPress: () => navigation.navigate('Dalle' as never),
            style: {
              borderRadius: 6,
            },
          },
        ]}
      />
      <TouchableOpacity
        onPress={() => {
          storage.save({
            key: 'userInfo',
            data: {
              //token: Platform.OS === 'ios' ? apnToken : fcmToken,
              accessToken: '',
              idToken: '',
              user: '',
            },
            expires: null,
          });
          console.log('logs');
          const signOut = async () => {
            try {
              await GoogleSignin.revokeAccess();
              await GoogleSignin.signOut();
            } catch (error) {
              console.error(error);
            }
          };
          signOut();
          RNRestart.Restart();
        }}
        style={{alignItems: 'center', flexDirection: 'row'}}>
        <Text style={{color: '#000A1A'}}>Token</Text>
      </TouchableOpacity>
      {/* <Text style={{color: '#000A1A'}}>{userInfo.user.email}</Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  coinHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: (window.width - window.width / 1.2) / 3,
  },
  sectionsBar: {
    marginTop: 20,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  sectionsBarMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    paddingHorizontal: 10,
    backgroundColor: '#E0ECFF',
    height: 48,
    width: window.width / 2.4,
    borderRadius: 6,
    marginLeft: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#D6DAE2',
    fontSize: 24,
    fontWeight: '600',
  },
  searchBar: {
    backgroundColor: '#EAECF0',
    marginHorizontal: (window.width - window.width / 1.2) / 3,
    borderRadius: 6,
    marginTop: 20,
    padding: 10,
  },
  questionBelow: {
    marginLeft: (window.width - window.width / 1.2) / 3,
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeaders: {
    fontSize: 14,
    color: '#000A1A',
    margin: 5,
  },
  questionSection: {
    backgroundColor: '#EAECF0',
    fontSize: 18,
    fontWeight: '400',
    height: window.height / 12,
    width: window.width / 2.4,
    borderRadius: 12,
  },
  questionMarks: {
    marginTop: 30,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  segmentedButtons: {
    marginTop: 10,
    marginHorizontal: (window.width - window.width / 1.2) / 3,
    borderRadius: 6,
  },
});

export default App;
