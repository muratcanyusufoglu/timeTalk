import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AsyncStorage} from 'react-native';

const window = Dimensions.get('window');

export default function ChatPage() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState<string>();
  const [bool, setBool] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const messageData: {
    message: string;
    user: string;
    date: string;
    messageData: {
      message: string;
      user: string;
      date: string;
      response: string;
    };
  }[] = [];
  const ADRESS = Config.ADRESS;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      await axios
        .get(`${ADRESS}/messages`)
        .then(item => {
          console.log('item', item, `${ADRESS}/messages`);
          item.data.map(mes => messageData.push(mes));
          setData(messageData.reverse());
        })
        .catch(error => {
          console.log('error', error);
        });
      setLoading(false);
    };

    fetch();
  }, [bool]);

  const addArray = async () => {
    setBool(true);
    var items;
    await axios
      .get(`${ADRESS}/messages/${input}`)
      .then(item => {
        items = item.data;
        console.log('dataresponse', item.data);
      })
      .catch(error => console.log('error', error));

    await axios
      .post(`${ADRESS}/messages`, {
        user: 'crazy_61',
        messageInfo: {
          message: `${input}`,
          user: 'crazy_61',
          response: `${items}`,
          date: '05.05.2010',
        },
      })
      .then(resp => {
        console.log('resp post', resp);
      })
      .catch(error => {
        console.log('error post', error);
      });

    await axios
      .get(`${ADRESS}/messages`)
      .then(item => {
        const messages = item.data;
        messageData.push(messages);
      })
      .catch(error => console.log('error', error));
    setInput('');
    setBool(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.loadingView}>
        {loading ? (
          <Lottie
            source={require('../assets/animations/messageLoad.json')}
            style={styles.animationLoading}
            autoPlay
            loop
          />
        ) : null}
      </View>
      <FlatList
        inverted
        extraData={data}
        data={data}
        refreshing={bool}
        renderItem={({item}) => (
          <>
            <View style={styles.messageSection}>
              <Text style={styles.sendedSection}>
                {item.messageInfo.message}
              </Text>
              <Text style={styles.responsSection}>
                {item.messageInfo.response}
              </Text>
            </View>
          </>
        )}
      />
      <View style={{alignItems: 'center'}}>
        {bool ? (
          <Lottie
            source={require('../assets/animations/messageLoad.json')}
            style={styles.animation}
            autoPlay
            loop
          />
        ) : null}
      </View>
      <View style={styles.sendMessageSection}>
        <TextInput
          style={styles.input}
          onChangeText={(text: string) => setInput(text)}
          value={input}
          placeholder="Message..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendMessageButton}
          onPress={() => addArray()}>
          <Icon name="send-o" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageSection: {
    margin: 5,
  },
  sendedSection: {
    backgroundColor: '#E0ECFF',
    marginLeft: window.width / 3,
    marginRight: window.width / 20,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  responsSection: {
    backgroundColor: '#E9EEF8',
    marginRight: window.width / 3,
    marginLeft: window.width / 20,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  animation: {
    width: window.width / 20,
    height: window.height / 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  animationLoading: {
    width: window.width / 12,
    height: window.height / 12,
  },
  sendMessageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 48,
    width: window.width / 1.25,
    marginHorizontal: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#D6DAE2',
    borderRadius: 4,
  },
  sendMessageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: window.width / 8,
    height: 48,
    borderWidth: 1,
    borderColor: '#D6DAE2',
    borderRadius: 4,
  },
  sendIcon: {},
});
