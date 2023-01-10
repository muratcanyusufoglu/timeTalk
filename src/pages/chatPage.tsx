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

const window = Dimensions.get('window');

export default function ChatPage() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState<string>();
  const [bool, setBool] = useState<boolean>();

  const messageData: {message: string; user: string; date: string}[] = [];
  const ADRESS = Config.ADRESS;

  useEffect(() => {
    axios
      .get(`${ADRESS}/messages`)
      .then(item => {
        console.log(item);
        item.data.map(mes => messageData.push(mes));
        setData(messageData.reverse());
      })
      .catch(error => console.log('error', error));
  }, [bool]);

  console.log('data', `${ADRESS}/messages/`);

  const addArray = async () => {
    setBool(true);
    var items;
    await axios
      .get(`${ADRESS}/messages/${input}`)
      .then(item => {
        items = item.data;
        console.log('data', `${ADRESS}/messages/${input}`);
      })
      .catch(error => console.log('error', error));

    await axios
      .post(`${ADRESS}/messages`, {
        message: `${input}`,
        user: 'crazy_61',
        date: `${items}`,
      })
      .then(resp => {
        console.log('resp', resp);
      })
      .catch(error => {
        console.log('error', error);
      });

    await axios
      .get(`${ADRESS}/messages`)
      .then(item => {
        const messages = item.data;
        messageData.push(messages);
      })
      .catch(error => console.log('error', error));
    setBool(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        extraData={data}
        data={data}
        refreshing={bool}
        renderItem={({item}) => (
          <>
            <View style={styles.messageSection}>
              <Text style={styles.sendedSection}>{item.message}</Text>
              <Text style={styles.responsSection}>{item.date}</Text>
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
    marginVertical: 2,
    borderRadius: 10,
  },
  responsSection: {
    backgroundColor: '#E9EEF8',
    marginRight: window.width / 3,
    marginLeft: window.width / 20,
    padding: 15,
    marginVertical: 2,
    borderRadius: 10,
  },
  animation: {
    width: window.width / 20,
    height: window.height / 20,
    alignItems: 'center',
    justifyContent: 'center',
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
